import prisma from "../database/prisma.js";
import { hashPassword } from "../utils/password.js";
import { generateOTP } from "../utils/otp.js";
import sendMail from "../utils/mailer.js";

export async function registerUser(email, password) {
  // Get the hash of the plainText password
  const hashedPassword = await hashPassword(password);

  // Insert the user info to DB
  const insertedUser = await prisma.user.create({
    data: {
      email: email,
      passwordHash: hashedPassword,
      isEmailVerified: false,
    },
  });

  try {
    // OTP generation
    const otpCode = generateOTP();

    // OTP expiring time
    const expiringTime = new Date(Date.now() + 3 * 60 * 1000);

    // Storing OTP to the DB
    const otpInsertion = await prisma.oTP.create({
      data: {
        userId: insertedUser.id,
        otpCode: otpCode,
        isUsed: false,
        expiresAt: expiringTime,
      },
    });

    // Sending OTP to their email

    const mailResult = await sendMail(
      email,
      "Your Task Vault OTP",
      `Hello! Your OTP is: ${otpCode}\nIt expires in 3 minutes.`
    );

    // Returning the response
    const result = {
      emailAddress: email,
      subject: "OTP sent to your email",
      mailSentStatus: mailResult.mailSentStatus || "Undeclared",
      mailURL: mailResult.mailURL || "Undeclared",
      mailResult: mailResult.mailResult || "Undeclared",
      toDo: "To complete registration head up to the following route: \n/register-verify",
    };

    return result;
  } catch (err) {
    // Returning this response if any error
    return {
      error: `Error occured: \n ${err}`,
    };
  }
}
