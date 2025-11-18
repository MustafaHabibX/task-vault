import prisma from "../database/prisma.js";
import { generateOTP } from "../utils/otp.js";
import sendMail from "../utils/mailer.js";

// * Requesting OTP *********************************************************************
export async function requestOTP(userID, userEmail) {
  try {
    // Create a new one
    // 1: OTP generation
    const otpCode = generateOTP();

    // 2: OTP expiring time
    const expiringTime = new Date(Date.now() + 3 * 60 * 1000);

    // 3: Storing new OTP to the DB
    await prisma.oTP.create({
      data: {
        userId: userID,
        otpCode: otpCode,
        isUsed: false,
        expiresAt: expiringTime,
      },
    });

    console.log("OTP created and stored in DB.");

    // 4: Send this e-mail to user containing the OTP
    const mailResult = await sendMail(
      userEmail,
      "Your Task Vault OTP",
      `Hello! Your OTP is: ${otpCode}\nIt expires in 3 minutes.`
    );

    console.log("OTP sent to user's mailbox.");

    // Return the mail URL
    return mailResult;
  } catch (err) {
    console.log(
      "Error occured when requesting an OTP or inserting it to DB: \n",
      err
    );
  }
}

// * Validation of OTP *********************************************************************
export async function findUserByEmail(email) {
  try {
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    return user ?? false;
  } catch (error) {
    console.error("Error finding user by email:", error);
    throw new Error("Database query failed");
  }
}

async function requestNewOTP(userID, userEmail) {
  try {
    // If there is an OTP, delete it
    const existingOTP = await prisma.oTP.findUnique({
      where: { userId: userID },
    });
    console.log(existingOTP);

    if (existingOTP) {
      // 1: Deleting their current OTP
      const deleteCurrentOTP = await prisma.oTP.delete({
        where: { id: existingOTP.id },
      });
      console.log("Deleted the current OTP");
    } else {
      console.log("OTP is not existing");
    }

    console.log("Requesting for a new OTP...");
    // 2: Requesting a new OTP
    const mailResult = await requestOTP(userID, userEmail);

    return mailResult;
  } catch (err) {
    console.error("An error occured when requesting a new OTP: \n", err);
    return {
      error: "An error occured when requesting a new OTP:",
      errorDetail: err,
    };
  }
}

async function updateOtpStatus(otpID) {
  try {
    await prisma.oTP.update({
      where: { id: otpID },
      data: {
        isUsed: true,
      },
    });
  } catch (err) {
    console.error(
      "Error occured when updating the OTP status to Used. \n",
      err
    );
  }
}

async function verifyUserEmail(userID) {
  try {
    await prisma.user.update({
      where: { id: userID },
      data: {
        isEmailVerified: true,
        updatedAt: new Date(),
      },
    });
  } catch (err) {
    console.error(
      "Error occured when updating the OTP status to Used. \n",
      err
    );
  }
}

export async function validateOTP(inputEmail, inputOTP) {
  // Find that specific user via their provided email, so that their id will be used to address their OTP
  const user = await findUserByEmail(inputEmail);

  if (user.id) {
    const userID = user.id;

    // With user's ID find their OTP
    const otpFromDB = await prisma.oTP.findUnique({
      where: {
        userId: userID,
      },
    });

    // * If OTP doesn't exist
    if (!otpFromDB) throw new Error("OTP not found");

    // * OTP is used or not
    if (!otpFromDB.isUsed) {
      // * OTP is expired or not
      if (otpFromDB.expiresAt <= new Date()) {
        // If the OTP is expired
        console.log(
          "OTP expired, requesting a new OTP. \nPlease check your email for the new OTP."
        );

        // Request a new OTP
        const mailResult = await requestNewOTP(userID, inputEmail);
        return {
          status: 410,
          error:
            "OTP expired, requesting a new OTP. \nPlease check your email for the new OTP.",
          newOTP: mailResult,
        };
      } else {
        // * OTP is matching with user inputOTP or not
        if (otpFromDB.otpCode === inputOTP) {
          console.log("OTP matched, your email is now verified.");
          // If matched:
          // 1: first update the otp status to => used
          await updateOtpStatus(otpFromDB.id);
          // 2: Make the user's email verified
          await verifyUserEmail(userID);

          return {
            status: 200,
            message: "Your email is successfully verified.",
          };
        } else {
          console.log("OTP not matched, try again.");

          return {
            status: 400,
            message: "OTP not matched, try again.",
          };
        }
      }
    } else {
      console.log("OTP is already used!");
      return {
        status: 400,
        error: "OTP is already used!",
      };
    }
  } else {
    console.log("Invalid credentials.");
    return {
      status: 404,
      error: "Invalid credentials.",
    };
  }
}
