"use server";
import "server-only";

import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const createToken = async (
  payload: Record<string, unknown>,
): Promise<string> => {
  const secret = process.env.JWT_SECRET;
  const expires = process.env.JWT_EXPIRES;

  // @ts-ignore
  return jwt.sign(
    { sub: payload?.email, role: payload?.role },
    secret as Secret,
    {
      expiresIn: expires,
    },
  );
};

export const verifyToken = async (
  token: string,
  secret: Secret,
): Promise<JwtPayload> => {
  return jwt.verify(token, secret) as JwtPayload;
};
