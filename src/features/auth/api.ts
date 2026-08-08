import { api } from "@/lib/api";

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  needsPinSetup: boolean;
};

export function fetchMe() {
  return api<PublicUser>("/api/auth/me");
}

export function checkDevice(deviceToken: string) {
  return api<PublicUser>("/api/auth/device/check", {
    method: "POST",
    body: JSON.stringify({ deviceToken }),
  });
}

export function loginWithGoogle(idToken: string) {
  return api<PublicUser & { deviceToken: string }>("/api/auth/google", {
    method: "POST",
    body: JSON.stringify({ idToken }),
  });
}

export function setupPin(deviceToken: string, pin: string) {
  return api<PublicUser>("/api/auth/pin/setup", {
    method: "POST",
    body: JSON.stringify({ deviceToken, pin }),
  });
}

export function verifyPin(deviceToken: string, pin: string) {
  return api<PublicUser>("/api/auth/pin/verify", {
    method: "POST",
    body: JSON.stringify({ deviceToken, pin }),
  });
}

export function logout() {
  return api<{ ok: true }>("/api/auth/logout", { method: "POST" });
}
