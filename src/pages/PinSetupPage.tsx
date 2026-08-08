import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { PinInput } from "@/features/auth/PinInput";

export default function PinSetupPage() {
  const { user, submitPinSetup } = useAuth();
  const [firstPin, setFirstPin] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleComplete(pin: string) {
    if (!firstPin) {
      setFirstPin(pin);
      setError(null);
      return;
    }

    if (pin !== firstPin) {
      setError("PIN tidak cocok, coba lagi dari awal.");
      setFirstPin(null);
      return;
    }

    setSubmitting(true);
    try {
      await submitPinSetup(pin);
    } catch {
      setError("Gagal menyimpan PIN, coba lagi.");
      setFirstPin(null);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 gap-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
          <ShieldCheck size={32} className="text-primary-foreground" />
        </div>
        <h1 className="text-xl font-extrabold text-foreground font-bricolage">
          {firstPin ? "Konfirmasi PIN" : "Buat PIN 4 Digit"}
        </h1>
        <p className="text-sm text-foreground/60 text-center">
          {firstPin
            ? "Masukkan ulang PIN yang sama untuk konfirmasi"
            : `Halo ${user?.name?.split(" ")[0] ?? ""}, buat PIN untuk mengamankan akunmu di device ini`}
        </p>
      </div>

      <PinInput key={firstPin ?? "first"} disabled={submitting} error={!!error} onComplete={handleComplete} />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
