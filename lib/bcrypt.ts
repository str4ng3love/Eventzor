import * as bcrypt from "bcrypt";
export async function hashPass(password: string) {
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);
  return hash;
}

export async function compare(password: string, hashedPassword: string) {
  return await bcrypt.compare(password, hashedPassword);
}
