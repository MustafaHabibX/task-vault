import bcrypt from "bcrypt";

export async function hashPassword(plainTextPassword) {
  const saltRounds = 10;
  const myPlaintextPassword = plainTextPassword;

  // Generating the salt anb hash
  const hashedPassword = await bcrypt.hash(myPlaintextPassword, saltRounds);

  return hashedPassword;
}

export async function verifyPassword(plainText, hash) {
  return await bcrypt.compare(plainText, hash);
}
