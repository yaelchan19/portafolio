import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes";
import Splash from "./components/Splash";
import { AuthProvider } from "./contexts/AuthContext";

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <Splash onFinish={() => setShowSplash(false)} durationMs={2500} />;
  }

  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}
