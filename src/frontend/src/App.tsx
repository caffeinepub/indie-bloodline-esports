import { Toaster } from "@/components/ui/sonner";
import AdminPage from "@/pages/AdminPage";
import LandingPage from "@/pages/LandingPage";
import { useState } from "react";

type View = "landing" | "admin";

export default function App() {
  const [view, setView] = useState<View>("landing");

  // Apply dark theme to html element
  if (typeof document !== "undefined") {
    document.documentElement.classList.add("dark");
    document.documentElement.style.setProperty("color-scheme", "dark");
  }

  return (
    <>
      {view === "landing" ? (
        <LandingPage onAdminClick={() => setView("admin")} />
      ) : (
        <AdminPage onBack={() => setView("landing")} />
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
