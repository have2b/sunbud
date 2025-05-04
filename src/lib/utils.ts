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

/**
 * Format a date into a readable string
 * @param date Date to format
 * @param options Date formatting options
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions) {
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('en-US', options || defaultOptions).format(dateObj);
}
