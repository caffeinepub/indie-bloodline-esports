import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePlayerSession } from "@/hooks/usePlayerSession";
import { ChevronLeft, Loader2, Swords } from "lucide-react";
import { useState } from "react";

interface PlayerLoginPageProps {
  onSuccess: () => void;
  onRegisterClick: () => void;
  onBack: () => void;
}

export default function PlayerLoginPage({
  onSuccess,
  onRegisterClick,
  onBack,
}: PlayerLoginPageProps) {
  const { login } = usePlayerSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const result = await login(username, password);
    setLoading(false);
    if (result === "success") {
      onSuccess();
    } else if (result === "invalid") {
      setError("Invalid credentials or account not yet approved by admin.");
    } else {
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative z-10 w-full max-w-md">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors"
          data-ocid="player_login.back_button"
        >
          <ChevronLeft size={16} />
          Back to Home
        </button>

        <div className="border border-border bg-card/80 backdrop-blur-sm p-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/20 border border-primary/30 flex items-center justify-center">
              <Swords className="text-primary" size={20} />
            </div>
            <h1 className="font-display font-black text-2xl text-foreground">
              PLAYER <span className="text-primary">LOGIN</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm mb-8">
            Sign in to access your dashboard and tournaments.
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label
                htmlFor="username"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                className="bg-secondary border-border rounded-none font-mono"
                data-ocid="player_login.input"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="password"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="bg-secondary border-border rounded-none"
                data-ocid="player_login.input"
              />
            </div>

            {error && (
              <p
                className="text-sm text-destructive border border-destructive/30 bg-destructive/10 px-3 py-2 rounded-none"
                data-ocid="player_login.error_state"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none font-display font-bold tracking-wider py-5"
              data-ocid="player_login.submit_button"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> SIGNING
                  IN...
                </>
              ) : (
                "SIGN IN"
              )}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-border text-center">
            <p className="text-sm text-muted-foreground">
              New player?{" "}
              <button
                type="button"
                onClick={onRegisterClick}
                className="text-primary hover:underline font-semibold"
                data-ocid="player_login.register_button"
              >
                Submit registration
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
