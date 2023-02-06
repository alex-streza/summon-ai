import * as argon2d from "argon2";

export const generateToken = async (n: number) => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let token = "";
  for (let i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }

  const hashedToken = await argon2d.hash(token);

  return { hashedToken, token };
};
