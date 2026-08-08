import { useState } from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { PinInput } from "@/features/auth/PinInput";
import { ApiError } from "@/lib/api";

export default function PinEntryPage() {
  const { user, submitPinVerify, signOut } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [locked, setLocked] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleComplete(pin: string) {
    setSubmitting(true);
    setError(null);
    try {
      await submitPinVerify(pin);
    } catch (err) {
      if (err instanceof ApiError && err.status === 423) {
        const seconds = (err.body as { secondsLeft?: number })?.secondsLeft;
        setLocked(true);
        setError(`Terlalu banyak percobaan. Coba lagi dalam ${Math.ceil((seconds ?? 0) / 60)} menit.`);
      } else if (err instanceof ApiError && err.status === 401) {
        const attemptsLeft = (err.body as { attemptsLeft?: number })?.attemptsLeft;
        setError(
          typeof attemptsLeft === "number"
            ? `PIN salah, sisa ${attemptsLeft} percobaan.`
            : "PIN salah, coba lagi."
        );
      } else {
        setError("Gagal verifikasi PIN, coba lagi.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 gap-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
          <Lock size={32} className="text-primary-foreground" />
        </div>
        <h1 className="text-xl font-extrabold text-foreground font-bricolage">
          Halo, {user?.name?.split(" ")[0] ?? "kembali"}
        </h1>
        <p className="text-sm text-foreground/60 text-center">Masukkan PIN untuk masuk</p>
      </div>

      <PinInput disabled={submitting || locked} error={!!error} onComplete={handleComplete} />

      {error && <p className="text-sm text-red-500 text-center max-w-xs">{error}</p>}

      <button onClick={() => signOut()} className="text-sm font-semibold text-secondary">
        Bukan {user?.name?.split(" ")[0]}? Ganti akun
      </button>
    </div>
  );
}
