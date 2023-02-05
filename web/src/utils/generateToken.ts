import * as argon2d from "argon2";

export const generateToken = async (n: number) => {
  var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  var token = "";
  for (var i = 0; i < n; i++) {
    token += chars[Math.floor(Math.random() * chars.length)];
  }

  const hashedToken = await argon2d.hash(token);

  return { hashedToken, token };
};
