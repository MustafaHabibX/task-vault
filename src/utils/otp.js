import crypto from "crypto";

export function generateOTP() {
  // *  To generate the OTP
  // 1: Generate a buffer
  const buf = crypto.randomBytes(3);

  // 2: Convert the buffer to a number (here it is a big number)
  const num = buf.readUIntBE(0, buf.length);

  // 3: Ensures OTP is within 100000-999999 range
  const generatedOTP = ((num % 900000) + 100000).toString();

  return generatedOTP;
}
