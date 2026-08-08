import { RouterProvider } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { router } from "@/router";
import { AuthProvider } from "@/features/auth/AuthContext";
import { useAuth } from "@/features/auth/useAuth";
import LoginPage from "@/pages/LoginPage";
import PinSetupPage from "@/pages/PinSetupPage";
import PinEntryPage from "@/pages/PinEntryPage";

function AuthGate() {
  const { status } = useAuth();

  switch (status) {
    case "loading":
      return <div className="min-h-screen bg-background" />;
    case "unauthenticated":
      return <LoginPage />;
    case "needs-pin-setup":
      return <PinSetupPage />;
    case "needs-pin":
      return <PinEntryPage />;
    case "authenticated":
      return <RouterProvider router={router} />;
  }
}

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
