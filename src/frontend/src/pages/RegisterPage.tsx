import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import {
  CheckCircle,
  ChevronLeft,
  Loader2,
  Shield,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";

const GAMEPLAY_LEVELS = [
  "Beginner",
  "Intermediate",
  "Player",
  "Pro Player",
  "Massive Cracker",
];

const PLAY_STYLES = ["One Tap Player", "AWM Head Marker", "Dragger"];

const ACCOUNT_TYPES = ["Google", "Facebook", "Twitter", "Other"];

interface RegisterPageProps {
  onLoginClick: () => void;
  onBack: () => void;
}

export default function RegisterPage({
  onLoginClick,
  onBack,
}: RegisterPageProps) {
  const { actor, isFetching } = useActor();
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const screenshotRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [screenshotName, setScreenshotName] = useState("");
  const [videoName, setVideoName] = useState("");
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);

  const [form, setForm] = useState({
    username: "",
    uid: "",
    gameAccountType: "",
    gameAccountEmail: "",
    gameAccountPassword: "",
    gameplayLevel: "",
    gameplayDescription: "",
    guildName: "",
  });

  const toggleStyle = (style: string) => {
    setSelectedStyles((prev) =>
      prev.includes(style) ? prev.filter((s) => s !== style) : [...prev, style],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!actor) {
      toast.error("Not connected to backend");
      return;
    }
    if (!form.gameAccountType) {
      toast.error("Please select a game account type");
      return;
    }
    if (!form.gameplayLevel) {
      toast.error("Please select a gameplay level");
      return;
    }
    if (selectedStyles.length === 0) {
      toast.error("Please select at least one play style");
      return;
    }

    setSubmitting(true);
    try {
      await actor.submitRegistration(
        form.username,
        form.uid,
        form.gameAccountType,
        form.gameAccountEmail,
        form.gameAccountPassword,
        [], // screenshotBlobId
        [], // screenRecordBlobId
        form.gameplayLevel,
        form.gameplayDescription,
        form.guildName,
        selectedStyles,
      );
      setSubmitted(true);
    } catch {
      toast.error("Registration failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div
        className="min-h-screen bg-background flex flex-col items-center justify-center px-4"
        data-ocid="register.success_state"
      >
        <div className="absolute inset-0 bg-grid opacity-20" />
        <div className="relative z-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="text-emerald-400" size={32} />
          </div>
          <h2 className="font-display font-black text-3xl text-foreground mb-3">
            REGISTRATION <span className="text-primary">SUBMITTED</span>
          </h2>
          <p className="text-muted-foreground mb-8">
            Your registration is pending admin approval. You will be able to log
            in once your account has been approved.
          </p>
          <Button
            onClick={onLoginClick}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none font-display font-bold tracking-wider px-8"
            data-ocid="register.login_button"
          >
            GO TO LOGIN
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-6 transition-colors"
            data-ocid="register.back_button"
          >
            <ChevronLeft size={16} />
            Back to Home
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Shield className="text-primary" size={28} />
            <h1 className="font-display font-black text-4xl text-foreground">
              PLAYER <span className="text-primary">REGISTRATION</span>
            </h1>
          </div>
          <p className="text-muted-foreground text-sm">
            Submit your details for admin review. Once approved, you can log in
            and join tournaments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="border border-border bg-card/50 p-6 space-y-4">
            <h3 className="font-display font-bold text-sm text-primary uppercase tracking-widest border-b border-border pb-2">
              Player Info
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Username *
                </Label>
                <Input
                  id="username"
                  value={form.username}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, username: e.target.value }))
                  }
                  required
                  className="bg-secondary border-border rounded-none font-mono"
                  data-ocid="register.input"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="uid"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  UID *
                </Label>
                <Input
                  id="uid"
                  value={form.uid}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, uid: e.target.value }))
                  }
                  required
                  className="bg-secondary border-border rounded-none font-mono"
                  data-ocid="register.input"
                />
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="guild"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Guild Name
                </Label>
                <Input
                  id="guild"
                  value={form.guildName}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, guildName: e.target.value }))
                  }
                  className="bg-secondary border-border rounded-none"
                  data-ocid="register.input"
                />
              </div>
            </div>
          </div>

          {/* Game Account */}
          <div className="border border-border bg-card/50 p-6 space-y-4">
            <h3 className="font-display font-bold text-sm text-primary uppercase tracking-widest border-b border-border pb-2">
              Game Account
            </h3>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Account Type *
              </Label>
              <Select
                value={form.gameAccountType}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, gameAccountType: v }))
                }
              >
                <SelectTrigger
                  className="bg-secondary border-border rounded-none"
                  data-ocid="register.select"
                >
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-none">
                  {ACCOUNT_TYPES.map((t) => (
                    <SelectItem key={t} value={t} className="rounded-none">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="email"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Game Account Email *
              </Label>
              <Input
                id="email"
                type="email"
                value={form.gameAccountEmail}
                onChange={(e) =>
                  setForm((p) => ({ ...p, gameAccountEmail: e.target.value }))
                }
                required
                className="bg-secondary border-border rounded-none"
                data-ocid="register.input"
              />
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="gpassword"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Game Account Password *
              </Label>
              <Input
                id="gpassword"
                type="password"
                value={form.gameAccountPassword}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    gameAccountPassword: e.target.value,
                  }))
                }
                required
                className="bg-secondary border-border rounded-none"
                data-ocid="register.input"
              />
            </div>
          </div>

          {/* File Uploads */}
          <div className="border border-border bg-card/50 p-6 space-y-4">
            <h3 className="font-display font-bold text-sm text-primary uppercase tracking-widest border-b border-border pb-2">
              Account Verification
            </h3>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Account Screenshot
              </Label>
              <button
                type="button"
                className="w-full border border-dashed border-border bg-secondary/50 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => screenshotRef.current?.click()}
                data-ocid="register.upload_button"
              >
                <Upload size={20} className="text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  {screenshotName || "Click to upload screenshot (JPG/PNG)"}
                </span>
                <input
                  ref={screenshotRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) =>
                    setScreenshotName(e.target.files?.[0]?.name || "")
                  }
                />
              </button>
            </div>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Account Collections Screen Record
              </Label>
              <button
                type="button"
                className="w-full border border-dashed border-border bg-secondary/50 p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                onClick={() => videoRef.current?.click()}
                data-ocid="register.upload_button"
              >
                <Upload size={20} className="text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  {videoName || "Click to upload screen recording (MP4/MOV)"}
                </span>
                <input
                  ref={videoRef}
                  type="file"
                  accept="video/*"
                  className="hidden"
                  onChange={(e) =>
                    setVideoName(e.target.files?.[0]?.name || "")
                  }
                />
              </button>
            </div>
          </div>

          {/* Gameplay */}
          <div className="border border-border bg-card/50 p-6 space-y-4">
            <h3 className="font-display font-bold text-sm text-primary uppercase tracking-widest border-b border-border pb-2">
              Gameplay Profile
            </h3>
            <div className="space-y-2">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Gameplay Level *
              </Label>
              <Select
                value={form.gameplayLevel}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, gameplayLevel: v }))
                }
              >
                <SelectTrigger
                  className="bg-secondary border-border rounded-none"
                  data-ocid="register.select"
                >
                  <SelectValue placeholder="Select your level" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border rounded-none">
                  {GAMEPLAY_LEVELS.map((l) => (
                    <SelectItem key={l} value={l} className="rounded-none">
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label
                htmlFor="gameplay"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Player Gameplay Description
              </Label>
              <Textarea
                id="gameplay"
                value={form.gameplayDescription}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    gameplayDescription: e.target.value,
                  }))
                }
                rows={3}
                placeholder="Describe your gameplay style, strengths, and experience..."
                className="bg-secondary border-border rounded-none resize-none"
                data-ocid="register.textarea"
              />
            </div>
            <div className="space-y-3">
              <span className="text-xs uppercase tracking-wider text-muted-foreground block">
                Play Style * (select all that apply)
              </span>
              <div className="flex flex-wrap gap-3">
                {PLAY_STYLES.map((style) => (
                  <label
                    key={style}
                    htmlFor={`style-${style.replace(/\s+/g, "-").toLowerCase()}`}
                    className="flex items-center gap-2 cursor-pointer group"
                  >
                    <Checkbox
                      id={`style-${style.replace(/\s+/g, "-").toLowerCase()}`}
                      checked={selectedStyles.includes(style)}
                      onCheckedChange={() => toggleStyle(style)}
                      className="rounded-none border-border data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                      data-ocid="register.checkbox"
                    />
                    <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
                      {style}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={submitting || isFetching}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-none font-display font-bold tracking-wider py-6 text-base"
            data-ocid="register.submit_button"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> SUBMITTING...
              </>
            ) : (
              "SUBMIT REGISTRATION"
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onLoginClick}
              className="text-primary hover:underline font-semibold"
              data-ocid="register.login_button"
            >
              Login here
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
