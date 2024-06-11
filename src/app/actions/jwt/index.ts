"use server";
import "server-only";

import jwt, { JwtPayload, Secret } from "jsonwebtoken";

export const createToken = (payload: Record<string, unknown>): string => {
  const secret = process.env.JWT_SECRET;
  const expires = process.env.JWT_EXPIRES;

  return jwt.sign(
    { sub: payload?.email, role: payload?.role },
    secret as Secret,
    {
      expiresIn: expires,
    },
  );
};

export const verifyToken = (token: string, secret: Secret): JwtPayload => {
  return jwt.verify(token, secret) as JwtPayload;
};
