import prisma from "../database/prisma.js";
import { hashPassword } from "../utils/password.js";
import * as otpService from "../services/otp-service.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

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

export async function loginUser(email, password) {
  // Finding that user with their provided email
  const user = await prisma.user.findUnique({ where: { email: email } });

  if (!user) {
    return { status: 401, error: "Invalid credentials." };
  }

  // Check email verification
  if (!user.isEmailVerified) {
    return { status: 403, error: "Email is not verified yet." };
  }

  // Compare input password with hashed password
  const isPasswordMatch = await bcrypt.compare(password, user.passwordHash); // Returns boolean

  if (!isPasswordMatch) {
    return { status: 401, error: "Invalid credentials." };
  }

  // Create JWT token
  const jwtToken = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );

  return { status: 200, message: "LoggedIn Successfull", jwtToken };
}
