import { TokenPayload } from "@/types/auth.dto";
import { clsx, type ClassValue } from "clsx";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function generateJWT(payload: TokenPayload) {
  const secretKey = new TextEncoder().encode(process.env.JWT_SECRET);
  const iat = Math.floor(Date.now() / 1000);
  const exp = iat + Number(process.env.EXPIRED_TIME!);

  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt(iat)
    .setExpirationTime(exp)
    .sign(secretKey);
}

export async function verifyJWT(token: string): Promise<JWTPayload> {
  const secret = new TextEncoder().encode(process.env.JWT_SECRET);
  const { payload } = await jwtVerify(token, secret);
  return payload;
}
