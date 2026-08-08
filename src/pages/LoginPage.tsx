import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Wallet } from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";

export default function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-6 gap-8">
      <div className="flex flex-col items-center gap-3">
        <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center">
          <Wallet size={32} className="text-primary-foreground" />
        </div>
        <h1 className="text-2xl font-extrabold text-foreground font-bricolage">Go Productive</h1>
        <p className="text-sm text-foreground/60 text-center">
          Masuk dengan akun Google untuk mulai mengelola keuanganmu
        </p>
      </div>

      <GoogleLogin
        onSuccess={async (credentialResponse) => {
          setError(null);
          if (!credentialResponse.credential) {
            setError("Gagal mendapatkan token dari Google");
            return;
          }
          try {
            await loginWithGoogle(credentialResponse.credential);
          } catch {
            setError("Gagal login dengan Google, coba lagi.");
          }
        }}
        onError={() => setError("Gagal login dengan Google, coba lagi.")}
      />

      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
