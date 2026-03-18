import { Toaster } from "@/components/ui/sonner";
import { usePlayerSession } from "@/hooks/usePlayerSession";
import { PlayerSessionProvider } from "@/hooks/usePlayerSessionProvider";
import AdminPage from "@/pages/AdminPage";
import LandingPage from "@/pages/LandingPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import PlayerDashboardPage from "@/pages/PlayerDashboardPage";
import PlayerLoginPage from "@/pages/PlayerLoginPage";
import PlayerProfilePage from "@/pages/PlayerProfilePage";
import RegisterPage from "@/pages/RegisterPage";
import { useState } from "react";

type View =
  | "landing"
  | "admin"
  | "register"
  | "playerLogin"
  | "playerDashboard"
  | "leaderboard"
  | "playerProfile";

if (typeof document !== "undefined") {
  document.documentElement.classList.add("dark");
  document.documentElement.style.setProperty("color-scheme", "dark");
}

function AppInner() {
  const [view, setView] = useState<View>("landing");
  const [playerProfileId, setPlayerProfileId] = useState<bigint>(BigInt(0));
  const { isLoggedIn } = usePlayerSession();

  const navigate = (v: View) => setView(v);

  const goToProfile = (id: bigint) => {
    setPlayerProfileId(id);
    setView("playerProfile");
  };

  return (
    <>
      {view === "landing" && (
        <LandingPage
          onAdminClick={() => navigate("admin")}
          onPlayerLoginClick={() =>
            navigate(isLoggedIn ? "playerDashboard" : "playerLogin")
          }
          onLeaderboardClick={() => navigate("leaderboard")}
          onRegisterClick={() => navigate("register")}
        />
      )}
      {view === "admin" && <AdminPage onBack={() => navigate("landing")} />}
      {view === "register" && (
        <RegisterPage
          onLoginClick={() => navigate("playerLogin")}
          onBack={() => navigate("landing")}
        />
      )}
      {view === "playerLogin" && (
        <PlayerLoginPage
          onSuccess={() => navigate("playerDashboard")}
          onRegisterClick={() => navigate("register")}
          onBack={() => navigate("landing")}
        />
      )}
      {view === "playerDashboard" && (
        <PlayerDashboardPage
          onLogout={() => navigate("landing")}
          onProfileClick={goToProfile}
        />
      )}
      {view === "leaderboard" && (
        <LeaderboardPage
          onBack={() => navigate("landing")}
          onPlayerClick={goToProfile}
        />
      )}
      {view === "playerProfile" && (
        <PlayerProfilePage
          playerId={playerProfileId}
          onBack={() => navigate("leaderboard")}
        />
      )}
      <Toaster
        position="bottom-right"
        toastOptions={{
          classNames: {
            toast:
              "bg-card border-border text-foreground rounded-none font-body",
            description: "text-muted-foreground",
            success: "border-emerald-500/30",
            error: "border-destructive/50",
          },
        }}
      />
    </>
  );
}

export default function App() {
  return (
    <PlayerSessionProvider>
      <AppInner />
    </PlayerSessionProvider>
  );
}
