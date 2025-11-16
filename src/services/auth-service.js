import prisma from "../database/prisma.js";
import { hashPassword } from "../utils/password.js";
import * as otpService from "../services/otp-service.js";

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
    const insertedUserID = insertedUser.id;

    // * Request an OTP for this user
    // The requestOTP does the following:
    // 1: Store this OTP into DB for this user
    // 2: Send the OTP to their email
    const otpMailResult = await otpService.requestOTP(insertedUserID, email);

    return otpMailResult;
  } catch (err) {
    console.error("An Error occured in auth-service.js: \n", err);
  }
}
