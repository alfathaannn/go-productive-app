import { createContext, useEffect, useState, type ReactNode } from "react";
import {
  checkDevice,
  fetchMe,
  loginWithGoogle as loginWithGoogleRequest,
  logout as logoutRequest,
  setupPin as setupPinRequest,
  verifyPin as verifyPinRequest,
  type PublicUser,
} from "./api";

const DEVICE_TOKEN_KEY = "gpa_device_token";

type AuthStatus = "loading" | "unauthenticated" | "needs-pin-setup" | "needs-pin" | "authenticated";

type AuthContextValue = {
  status: AuthStatus;
  user: PublicUser | null;
  loginWithGoogle: (idToken: string) => Promise<void>;
  submitPinSetup: (pin: string) => Promise<void>;
  submitPinVerify: (pin: string) => Promise<void>;
  /** Ends the browser session but keeps this device linked, so next time only the PIN is asked. */
  lock: () => Promise<void>;
  /** Fully signs out: forgets this device, next time requires Google sign-in again. */
  signOut: () => Promise<void>;
};

// eslint-disable-next-line react-refresh/only-export-components -- consumed only via useAuth()
export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [user, setUser] = useState<PublicUser | null>(null);
  const [deviceToken, setDeviceToken] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const me = await fetchMe();
        setUser(me);
        setStatus("authenticated");
        return;
      } catch {
        // no active session, fall through to device check
      }

      const storedToken = localStorage.getItem(DEVICE_TOKEN_KEY);
      if (!storedToken) {
        setStatus("unauthenticated");
        return;
      }

      try {
        const linkedUser = await checkDevice(storedToken);
        setDeviceToken(storedToken);
        setUser(linkedUser);
        setStatus(linkedUser.needsPinSetup ? "needs-pin-setup" : "needs-pin");
      } catch {
        localStorage.removeItem(DEVICE_TOKEN_KEY);
        setStatus("unauthenticated");
      }
    })();
  }, []);

  async function loginWithGoogle(idToken: string) {
    const result = await loginWithGoogleRequest(idToken);
    localStorage.setItem(DEVICE_TOKEN_KEY, result.deviceToken);
    setDeviceToken(result.deviceToken);
    setUser(result);
    setStatus(result.needsPinSetup ? "needs-pin-setup" : "needs-pin");
  }

  async function submitPinSetup(pin: string) {
    if (!deviceToken) throw new Error("No linked device");
    const result = await setupPinRequest(deviceToken, pin);
    setUser(result);
    setStatus("authenticated");
  }

  async function submitPinVerify(pin: string) {
    if (!deviceToken) throw new Error("No linked device");
    const result = await verifyPinRequest(deviceToken, pin);
    setUser(result);
    setStatus("authenticated");
  }

  async function lock() {
    await logoutRequest().catch(() => undefined);
    setStatus("needs-pin");
  }

  async function signOut() {
    await logoutRequest().catch(() => undefined);
    localStorage.removeItem(DEVICE_TOKEN_KEY);
    setDeviceToken(null);
    setUser(null);
    setStatus("unauthenticated");
  }

  return (
    <AuthContext.Provider
      value={{ status, user, loginWithGoogle, submitPinSetup, submitPinVerify, lock, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}
