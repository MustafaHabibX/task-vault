import prisma from "../database/prisma.js";
import { generateOTP } from "../utils/otp.js";
import sendMail from "../utils/mailer.js";

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

    console.log("OTP sent to user via their provided E-mail.");

    // Return the mail URL
    return mailResult;
  } catch (err) {
    console.log(
      "Error occured when requesting an OTP or inserting it to DB: \n",
      err
    );
  }
}
