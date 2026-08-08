import { Router } from "express";
import rateLimit from "express-rate-limit";
import bcrypt from "bcryptjs";
import { OAuth2Client } from "google-auth-library";
import { prisma } from "../lib/prisma.js";
import { generateDeviceToken, hashDeviceToken } from "../lib/tokens.js";
import { SESSION_COOKIE_NAME, sessionCookieOptions, signSessionToken } from "../lib/jwt.js";
import { requireAuth } from "../middleware/auth.js";

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
if (!GOOGLE_CLIENT_ID) {
  throw new Error("GOOGLE_CLIENT_ID is not set in environment variables");
}

const googleClient = new OAuth2Client(GOOGLE_CLIENT_ID);

const MAX_PIN_ATTEMPTS = 5;
const PIN_LOCK_DURATION_MS = 15 * 60 * 1000;
const PIN_REGEX = /^\d{4}$/;

export const authRouter = Router();

const pinRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: true,
  legacyHeaders: false,
});

function toPublicUser(user: { id: string; name: string; email: string; avatarUrl: string | null; pinHash: string | null }) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
    needsPinSetup: !user.pinHash,
  };
}

authRouter.post("/google", async (req, res) => {
  const { idToken } = req.body;
  if (typeof idToken !== "string") {
    res.status(400).json({ error: "idToken is required" });
    return;
  }

  let payload;
  try {
    const ticket = await googleClient.verifyIdToken({ idToken, audience: GOOGLE_CLIENT_ID });
    payload = ticket.getPayload();
  } catch {
    res.status(401).json({ error: "Invalid Google token" });
    return;
  }

  if (!payload?.sub || !payload.email) {
    res.status(401).json({ error: "Invalid Google token" });
    return;
  }

  const user = await prisma.user.upsert({
    where: { googleId: payload.sub },
    update: {
      name: payload.name ?? "User",
      avatarUrl: payload.picture ?? null,
    },
    create: {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name ?? "User",
      avatarUrl: payload.picture ?? null,
    },
  });

  const deviceToken = generateDeviceToken();
  await prisma.deviceSession.create({
    data: { userId: user.id, tokenHash: hashDeviceToken(deviceToken) },
  });

  res.json({ deviceToken, ...toPublicUser(user) });
});

authRouter.post("/device/check", async (req, res) => {
  const { deviceToken } = req.body;
  if (typeof deviceToken !== "string") {
    res.status(400).json({ error: "deviceToken is required" });
    return;
  }

  const session = await prisma.deviceSession.findUnique({
    where: { tokenHash: hashDeviceToken(deviceToken) },
    include: { user: true },
  });

  if (!session) {
    res.status(401).json({ error: "Device not linked" });
    return;
  }

  res.json(toPublicUser(session.user));
});

authRouter.post("/pin/setup", async (req, res) => {
  const { deviceToken, pin } = req.body;
  if (typeof deviceToken !== "string" || typeof pin !== "string" || !PIN_REGEX.test(pin)) {
    res.status(400).json({ error: "deviceToken and a 4-digit pin are required" });
    return;
  }

  const session = await prisma.deviceSession.findUnique({
    where: { tokenHash: hashDeviceToken(deviceToken) },
    include: { user: true },
  });

  if (!session) {
    res.status(401).json({ error: "Device not linked" });
    return;
  }

  if (session.user.pinHash) {
    res.status(409).json({ error: "PIN already set for this account" });
    return;
  }

  const pinHash = await bcrypt.hash(pin, 10);
  const user = await prisma.user.update({
    where: { id: session.userId },
    data: { pinHash },
  });

  const sessionToken = signSessionToken(user.id);
  res.cookie(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions());
  res.json(toPublicUser(user));
});

authRouter.post("/pin/verify", pinRateLimit, async (req, res) => {
  const { deviceToken, pin } = req.body;
  if (typeof deviceToken !== "string" || typeof pin !== "string" || !PIN_REGEX.test(pin)) {
    res.status(400).json({ error: "deviceToken and a 4-digit pin are required" });
    return;
  }

  const session = await prisma.deviceSession.findUnique({
    where: { tokenHash: hashDeviceToken(deviceToken) },
    include: { user: true },
  });

  if (!session) {
    res.status(401).json({ error: "Device not linked" });
    return;
  }

  const user = session.user;

  if (!user.pinHash) {
    res.status(409).json({ error: "PIN not set for this account" });
    return;
  }

  if (user.pinLockedUntil && user.pinLockedUntil > new Date()) {
    const secondsLeft = Math.ceil((user.pinLockedUntil.getTime() - Date.now()) / 1000);
    res.status(423).json({ error: "PIN locked, try again later", secondsLeft });
    return;
  }

  const isValid = await bcrypt.compare(pin, user.pinHash);

  if (!isValid) {
    const failedPinAttempts = user.failedPinAttempts + 1;
    const lockedOut = failedPinAttempts >= MAX_PIN_ATTEMPTS;
    await prisma.user.update({
      where: { id: user.id },
      data: {
        failedPinAttempts: lockedOut ? 0 : failedPinAttempts,
        pinLockedUntil: lockedOut ? new Date(Date.now() + PIN_LOCK_DURATION_MS) : null,
      },
    });
    res.status(401).json({
      error: "Incorrect PIN",
      attemptsLeft: lockedOut ? 0 : MAX_PIN_ATTEMPTS - failedPinAttempts,
    });
    return;
  }

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { failedPinAttempts: 0, pinLockedUntil: null },
    }),
    prisma.deviceSession.update({
      where: { id: session.id },
      data: { lastUsedAt: new Date() },
    }),
  ]);

  const sessionToken = signSessionToken(user.id);
  res.cookie(SESSION_COOKIE_NAME, sessionToken, sessionCookieOptions());
  res.json(toPublicUser(user));
});

authRouter.get("/me", requireAuth, async (req, res) => {
  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(toPublicUser(user));
});

authRouter.post("/logout", (req, res) => {
  res.clearCookie(SESSION_COOKIE_NAME, sessionCookieOptions());
  res.json({ ok: true });
});
