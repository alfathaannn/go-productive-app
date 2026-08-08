import jwt from "jsonwebtoken";

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not set in environment variables");
}
const JWT_SECRET: string = process.env.JWT_SECRET;

const SESSION_COOKIE_NAME = "session";

export function signSessionToken(userId: string) {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: "12h" });
}

export function verifySessionToken(token: string): { sub: string } {
  return jwt.verify(token, JWT_SECRET) as { sub: string };
}

// No maxAge on purpose: this must be a browser-session cookie so closing the
// browser/app clears it and the user is asked for their PIN again next time,
// even though the linked device (deviceToken) is remembered indefinitely.
export function sessionCookieOptions() {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: (isProduction ? "none" : "lax") as "none" | "lax",
    path: "/",
  };
}

export { SESSION_COOKIE_NAME };
