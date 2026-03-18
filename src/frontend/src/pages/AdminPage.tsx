import type { Tournament as BackendTournament } from "@/backend";
import {
  PlayersRankingsTab,
  RegistrationsTab,
  TournamentJoinsTab,
} from "@/components/admin/PlayerAdminTabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useActor } from "@/hooks/useActor";
import {
  type GalleryItem,
  type SiteInfo,
  type Tournament,
  useGallery,
  useSiteInfo,
} from "@/hooks/useLocalStore";
import { usePlayerSession } from "@/hooks/usePlayerSession";
import {
  ArrowLeft,
  Edit2,
  Image as ImageIcon,
  Loader2,
  LogOut,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface AdminPageProps {
  onBack: () => void;
}

const STATUS_COLORS = {
  upcoming: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  ongoing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  completed: "bg-muted/50 text-muted-foreground border-border",
};

// ─── Login Screen ────────────────────────────────────────────────────────────

function LoginScreen({ onBack }: { onBack: () => void }) {
  const { login } = usePlayerSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const result = await login(username, password);
    setIsLoading(false);
    if (result !== "success") {
      setError("Invalid username or password. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at center, oklch(0.62 0.23 25 / 5%), transparent 60%)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8 text-sm"
        >
          <ArrowLeft size={16} />
          Back to site
        </button>

        {/* Login Card */}
        <div className="bg-card border border-border p-8 rounded-none neon-border">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8">
            <img
              src="/assets/generated/logo-transparent.dim_400x400.png"
              alt="Indie Bloodline Esports"
              className="w-10 h-10 object-contain rounded"
            />
            <div>
              <div className="font-display font-black text-base">
                <span className="text-primary">INDIE</span> BLOODLINE
              </div>
              <div className="text-xs text-muted-foreground tracking-wider uppercase">
                Admin Access
              </div>
            </div>
          </div>

          <h1 className="font-display font-black text-2xl text-foreground mb-2 neon-glow">
            Admin Panel
          </h1>
          <p className="text-muted-foreground text-sm mb-8 leading-relaxed">
            Enter your credentials to access the content management system.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="admin-username"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Username
              </Label>
              <Input
                id="admin-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="bg-secondary border-border text-foreground rounded-none"
                data-ocid="admin.username.input"
                required
                autoComplete="username"
              />
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="admin-password"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Password
              </Label>
              <Input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="bg-secondary border-border text-foreground rounded-none"
                data-ocid="admin.password.input"
                required
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p
                className="text-xs text-destructive bg-destructive/10 border border-destructive/30 px-3 py-2 rounded-none"
                data-ocid="admin.error_state"
              >
                {error}
              </p>
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-base py-6 rounded-none neon-border transition-all"
              data-ocid="admin.login_button"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ─── Tournament Form ──────────────────────────────────────────────────────────

type TournamentFormData = Omit<Tournament, "id" | "sortOrder">;
const EMPTY_TOURNAMENT: TournamentFormData = {
  title: "",
  game: "",
  date: "",
  prizePool: "",
  status: "upcoming",
  registrationUrl: "",
  bannerImage: "",
};

interface TournamentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: Tournament | null;
  onSave: (data: TournamentFormData) => void;
}

function TournamentFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: TournamentFormDialogProps) {
  const [form, setForm] = useState<TournamentFormData>(
    initial ? { ...initial } : { ...EMPTY_TOURNAMENT },
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (field: keyof TournamentFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setForm((prev) => ({
          ...prev,
          bannerImage: ev.target!.result as string,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.game.trim() || !form.date.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }
    onSave(form);
    onOpenChange(false);
  };

  // Reset form when dialog opens with new initial
  const handleOpenChange = (open: boolean) => {
    if (open) setForm(initial ? { ...initial } : { ...EMPTY_TOURNAMENT });
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="bg-card border-border max-w-lg rounded-none"
        data-ocid="tournament.form.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-foreground">
            {initial ? "Edit Tournament" : "Add Tournament"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-1.5">
              <Label
                htmlFor="t-title"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Title *
              </Label>
              <Input
                id="t-title"
                value={form.title}
                onChange={(e) => handleChange("title", e.target.value)}
                placeholder="Free Fire Championship Season 6"
                className="bg-secondary border-border text-foreground rounded-none"
                data-ocid="tournament.title.input"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="t-game"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Game *
                </Label>
                <Input
                  id="t-game"
                  value={form.game}
                  onChange={(e) => handleChange("game", e.target.value)}
                  placeholder="Free Fire"
                  className="bg-secondary border-border text-foreground rounded-none"
                  data-ocid="tournament.game.input"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="t-date"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Date *
                </Label>
                <Input
                  id="t-date"
                  value={form.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  placeholder="March 20, 2026"
                  className="bg-secondary border-border text-foreground rounded-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label
                  htmlFor="t-prize"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Prize Pool
                </Label>
                <Input
                  id="t-prize"
                  value={form.prizePool}
                  onChange={(e) => handleChange("prizePool", e.target.value)}
                  placeholder="$500"
                  className="bg-secondary border-border text-foreground rounded-none"
                />
              </div>

              <div className="space-y-1.5">
                <Label
                  htmlFor="t-status"
                  className="text-xs uppercase tracking-wider text-muted-foreground"
                >
                  Status
                </Label>
                <Select
                  value={form.status}
                  onValueChange={(v) => handleChange("status", v)}
                >
                  <SelectTrigger
                    id="t-status"
                    className="bg-secondary border-border text-foreground rounded-none"
                    data-ocid="tournament.status.select"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-popover border-border rounded-none">
                    <SelectItem value="upcoming">Upcoming</SelectItem>
                    <SelectItem value="ongoing">Ongoing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label
                htmlFor="t-url"
                className="text-xs uppercase tracking-wider text-muted-foreground"
              >
                Registration URL
              </Label>
              <Input
                id="t-url"
                value={form.registrationUrl}
                onChange={(e) =>
                  handleChange("registrationUrl", e.target.value)
                }
                placeholder="https://discord.gg/..."
                className="bg-secondary border-border text-foreground rounded-none"
              />
            </div>

            {/* Banner Image */}
            <div className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                Banner Image
              </Label>
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  className="border-border text-foreground hover:border-primary/50 rounded-none"
                  data-ocid="tournament.upload_button"
                >
                  <ImageIcon size={14} className="mr-2" />
                  Upload Image
                </Button>
                {form.bannerImage && (
                  <img
                    src={form.bannerImage}
                    alt="Banner preview"
                    className="h-10 w-16 object-cover border border-border rounded-sm"
                  />
                )}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground rounded-none"
              data-ocid="tournament.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold rounded-none"
              data-ocid="tournament.submit_button"
            >
              {initial ? "Save Changes" : "Add Tournament"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Tournaments Tab ──────────────────────────────────────────────────────────

function TournamentsTab() {
  const { actor } = useActor();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [_loadingT, setLoadingT] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Tournament | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadTournaments = useCallback(async () => {
    if (!actor) return;
    setLoadingT(true);
    try {
      const data: BackendTournament[] = await actor.getTournaments();
      setTournaments(
        data.map((t) => ({
          id: t.id.toString(),
          title: t.title,
          game: t.game,
          date: t.date,
          prizePool: t.prizePool,
          status: t.status as Tournament["status"],
          registrationUrl: t.registrationUrl,
          bannerImage: t.bannerImageId[0],
          sortOrder: Number(t.sortOrder),
        })),
      );
    } catch {
      toast.error("Failed to load tournaments");
    } finally {
      setLoadingT(false);
    }
  }, [actor]);

  useEffect(() => {
    loadTournaments();
  }, [loadTournaments]);

  const handleSave = async (data: Omit<Tournament, "id" | "sortOrder">) => {
    if (!actor) return;
    try {
      if (editTarget) {
        await actor.updateTournament(
          BigInt(editTarget.id),
          data.title,
          data.game,
          data.date,
          data.prizePool,
          data.status,
          data.registrationUrl,
          data.bannerImage ? [data.bannerImage] : [],
          BigInt(editTarget.sortOrder),
        );
        toast.success("Tournament updated");
      } else {
        await actor.addTournament(
          data.title,
          data.game,
          data.date,
          data.prizePool,
          data.status,
          data.registrationUrl,
          data.bannerImage ? [data.bannerImage] : [],
          BigInt(tournaments.length),
        );
        toast.success("Tournament added");
      }
      setEditTarget(null);
      await loadTournaments();
    } catch {
      toast.error("Failed to save tournament");
    }
  };

  const handleEdit = (t: Tournament) => {
    setEditTarget(t);
    setFormOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!actor || !deleteId) return;
    try {
      await actor.deleteTournament(BigInt(deleteId));
      toast.success("Tournament deleted");
      setDeleteId(null);
      await loadTournaments();
    } catch {
      toast.error("Failed to delete tournament");
    }
  };

  const sorted = [...tournaments].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {tournaments.length} tournament(s)
        </p>
        <Button
          onClick={() => {
            setEditTarget(null);
            setFormOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold rounded-none"
          data-ocid="tournaments.add_button"
        >
          <Plus size={16} className="mr-2" />
          Add Tournament
        </Button>
      </div>

      {/* Table */}
      {sorted.length === 0 ? (
        <div
          className="text-center py-16 border border-border/50 bg-card/50"
          data-ocid="tournaments.empty_state"
        >
          <p className="text-muted-foreground">
            No tournaments yet. Add one above.
          </p>
        </div>
      ) : (
        <div
          className="border border-border rounded-none overflow-hidden"
          data-ocid="tournaments.table"
        >
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground font-display text-xs uppercase tracking-wider">
                  Title
                </TableHead>
                <TableHead className="text-muted-foreground font-display text-xs uppercase tracking-wider hidden sm:table-cell">
                  Game
                </TableHead>
                <TableHead className="text-muted-foreground font-display text-xs uppercase tracking-wider hidden md:table-cell">
                  Date
                </TableHead>
                <TableHead className="text-muted-foreground font-display text-xs uppercase tracking-wider">
                  Status
                </TableHead>
                <TableHead className="text-muted-foreground font-display text-xs uppercase tracking-wider text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.map((t, index) => {
                const ocidIndex = index + 1;
                return (
                  <TableRow
                    key={t.id}
                    className="border-border hover:bg-secondary/30"
                    data-ocid={`tournaments.row.${ocidIndex}`}
                  >
                    <TableCell className="font-medium text-foreground max-w-48 truncate">
                      {t.title}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden sm:table-cell">
                      {t.game}
                    </TableCell>
                    <TableCell className="text-muted-foreground hidden md:table-cell text-sm">
                      {t.date}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={`text-xs ${STATUS_COLORS[t.status]}`}
                      >
                        {t.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(t)}
                          className="w-8 h-8 text-muted-foreground hover:text-primary"
                          data-ocid={`tournaments.edit_button.${ocidIndex}`}
                        >
                          <Edit2 size={13} />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setDeleteId(t.id)}
                          className="w-8 h-8 text-muted-foreground hover:text-destructive"
                          data-ocid={`tournaments.delete_button.${ocidIndex}`}
                        >
                          <Trash2 size={13} />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      <TournamentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editTarget}
        onSave={handleSave}
      />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="bg-card border-border rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-foreground">
              Delete Tournament?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This action cannot be undone. The tournament will be permanently
              removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border text-foreground hover:bg-secondary rounded-none"
              data-ocid="tournaments.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-none"
              data-ocid="tournaments.confirm_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Gallery Tab ──────────────────────────────────────────────────────────────

interface GalleryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial?: GalleryItem | null;
  onSave: (data: Omit<GalleryItem, "id" | "sortOrder">) => void;
}

function GalleryFormDialog({
  open,
  onOpenChange,
  initial,
  onSave,
}: GalleryFormDialogProps) {
  const [caption, setCaption] = useState(initial?.caption ?? "");
  const [image, setImage] = useState(initial?.image ?? "");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      setCaption(initial?.caption ?? "");
      setImage(initial?.image ?? "");
    }
    onOpenChange(open);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) setImage(ev.target.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      toast.error("Caption is required");
      return;
    }
    onSave({ caption, image });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="bg-card border-border max-w-md rounded-none"
        data-ocid="gallery.form.dialog"
      >
        <DialogHeader>
          <DialogTitle className="font-display font-bold text-foreground">
            {initial ? "Edit Gallery Item" : "Add Photo"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="g-caption"
              className="text-xs uppercase tracking-wider text-muted-foreground"
            >
              Caption *
            </Label>
            <Input
              id="g-caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Free Fire Grand Finals"
              className="bg-secondary border-border text-foreground rounded-none"
              data-ocid="gallery.caption.input"
              required
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Image
            </Label>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="border-border text-foreground hover:border-primary/50 rounded-none"
              data-ocid="gallery.upload_button"
            >
              <ImageIcon size={14} className="mr-2" />
              Upload Photo
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            {image && (
              <img
                src={image}
                alt="Preview"
                className="w-full h-32 object-cover border border-border rounded-sm"
              />
            )}
          </div>

          <DialogFooter className="gap-2 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-muted-foreground hover:text-foreground rounded-none"
              data-ocid="gallery.cancel_button"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold rounded-none"
              data-ocid="gallery.save_button"
            >
              {initial ? "Save Changes" : "Add Photo"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function GalleryTab() {
  const { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem } =
    useGallery();
  const [formOpen, setFormOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<GalleryItem | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = (data: Omit<GalleryItem, "id" | "sortOrder">) => {
    if (editTarget) {
      updateGalleryItem(editTarget.id, data);
      toast.success("Gallery item updated");
    } else {
      addGalleryItem(data);
      toast.success("Photo added");
    }
    setEditTarget(null);
  };

  const sorted = [...gallery].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {gallery.length} item(s)
        </p>
        <Button
          onClick={() => {
            setEditTarget(null);
            setFormOpen(true);
          }}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold rounded-none"
          data-ocid="gallery.add_button"
        >
          <Plus size={16} className="mr-2" />
          Add Photo
        </Button>
      </div>

      {sorted.length === 0 ? (
        <div
          className="text-center py-16 border border-border/50 bg-card/50"
          data-ocid="gallery.empty_state"
        >
          <p className="text-muted-foreground">
            No gallery items. Add a photo above.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {sorted.map((item, index) => {
            const ocidIndex = index + 1;
            return (
              <div
                key={item.id}
                className="group relative bg-card border border-border overflow-hidden rounded-none"
                data-ocid={`gallery.item.${ocidIndex}`}
              >
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.caption}
                    className="w-full aspect-video object-cover"
                  />
                ) : (
                  <div className="w-full aspect-video bg-secondary flex items-center justify-center">
                    <ImageIcon size={24} className="text-muted-foreground/40" />
                  </div>
                )}
                <div className="p-3">
                  <p className="text-sm text-foreground font-medium truncate">
                    {item.caption}
                  </p>
                </div>
                {/* Overlay actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setEditTarget(item);
                      setFormOpen(true);
                    }}
                    className="w-9 h-9 bg-background/80 text-foreground hover:text-primary rounded-none"
                    data-ocid={`gallery.edit_button.${ocidIndex}`}
                  >
                    <Edit2 size={14} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setDeleteId(item.id)}
                    className="w-9 h-9 bg-background/80 text-foreground hover:text-destructive rounded-none"
                    data-ocid={`gallery.delete_button.${ocidIndex}`}
                  >
                    <Trash2 size={14} />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <GalleryFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        initial={editTarget}
        onSave={handleSave}
      />

      <AlertDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
      >
        <AlertDialogContent className="bg-card border-border rounded-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="font-display text-foreground">
              Delete Photo?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-muted-foreground">
              This photo will be permanently removed from the gallery.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border-border text-foreground hover:bg-secondary rounded-none"
              data-ocid="gallery.cancel_button"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  deleteGalleryItem(deleteId);
                  toast.success("Photo deleted");
                  setDeleteId(null);
                }
              }}
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-none"
              data-ocid="gallery.confirm_button"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

// ─── Site Info Tab ────────────────────────────────────────────────────────────

function SiteInfoTab() {
  const { siteInfo, updateSiteInfo } = useSiteInfo();
  const [form, setForm] = useState<SiteInfo>({ ...siteInfo });
  const [saving, setSaving] = useState(false);

  const handleChange = (field: keyof SiteInfo, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    // Simulate async save
    await new Promise((r) => setTimeout(r, 400));
    updateSiteInfo(form);
    setSaving(false);
    toast.success("Site info saved");
  };

  return (
    <form
      onSubmit={handleSave}
      className="space-y-6 max-w-2xl"
      data-ocid="siteinfo.form"
    >
      <div className="grid grid-cols-1 gap-4">
        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            About Text
          </Label>
          <Textarea
            value={form.aboutText}
            onChange={(e) => handleChange("aboutText", e.target.value)}
            rows={4}
            className="bg-secondary border-border text-foreground rounded-none resize-none"
            data-ocid="siteinfo.about.textarea"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-xs uppercase tracking-wider text-muted-foreground">
            Mission Text
          </Label>
          <Textarea
            value={form.missionText}
            onChange={(e) => handleChange("missionText", e.target.value)}
            rows={3}
            className="bg-secondary border-border text-foreground rounded-none resize-none"
            data-ocid="siteinfo.mission.textarea"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Contact Email
            </Label>
            <Input
              type="email"
              value={form.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
              className="bg-secondary border-border text-foreground rounded-none"
              data-ocid="siteinfo.email.input"
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs uppercase tracking-wider text-muted-foreground">
              Phone
            </Label>
            <Input
              value={form.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="bg-secondary border-border text-foreground rounded-none"
              data-ocid="siteinfo.phone.input"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <h4 className="font-display font-bold text-foreground text-sm mb-3 uppercase tracking-wider">
          Social Links
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { key: "facebookUrl", label: "Facebook URL" },
            { key: "discordUrl", label: "Discord URL" },
            { key: "youtubeUrl", label: "YouTube URL" },
            { key: "instagramUrl", label: "Instagram URL" },
            { key: "twitterUrl", label: "Twitter/X URL" },
          ].map(({ key, label }) => (
            <div key={key} className="space-y-1.5">
              <Label className="text-xs uppercase tracking-wider text-muted-foreground">
                {label}
              </Label>
              <Input
                type="url"
                value={form[key as keyof SiteInfo]}
                onChange={(e) =>
                  handleChange(key as keyof SiteInfo, e.target.value)
                }
                placeholder="https://..."
                className="bg-secondary border-border text-foreground rounded-none text-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <Button
        type="submit"
        disabled={saving}
        className="bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold rounded-none px-8"
        data-ocid="siteinfo.save_button"
      >
        {saving ? (
          <>
            <Loader2 size={16} className="mr-2 animate-spin" />
            Saving...
          </>
        ) : (
          <>
            <Save size={16} className="mr-2" />
            Save Changes
          </>
        )}
      </Button>
    </form>
  );
}

// ─── Admin CMS Layout ─────────────────────────────────────────────────────────

function AdminCMS({ onBack }: { onBack: () => void }) {
  const { logout, player } = usePlayerSession();

  const handleLogout = () => {
    logout();
    toast.success("Logged out");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-background/95 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors text-sm"
              data-ocid="admin.back_button"
            >
              <ArrowLeft size={16} />
              <span className="hidden sm:inline">Back to Site</span>
            </button>
            <span className="text-border">·</span>
            <div className="flex items-center gap-2">
              <img
                src="/assets/generated/logo-transparent.dim_400x400.png"
                alt="Logo"
                className="w-7 h-7 rounded object-contain"
              />
              <span className="font-display font-bold text-sm text-foreground">
                <span className="text-primary">IBE</span> Admin
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {player?.username && (
              <span className="hidden sm:block text-xs text-muted-foreground font-mono bg-secondary px-2 py-1 rounded">
                {player.username}
              </span>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground rounded-none text-xs"
              data-ocid="admin.logout_button"
            >
              <LogOut size={14} className="mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* CMS Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="font-display font-black text-3xl text-foreground neon-glow mb-1">
            Content Manager
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage tournaments, gallery, site information, and players
          </p>
        </div>

        <Tabs defaultValue="tournaments" className="space-y-6">
          <TabsList className="bg-secondary border border-border rounded-none h-auto p-1 gap-1 flex-wrap">
            <TabsTrigger
              value="tournaments"
              className="font-display font-semibold text-sm rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
              data-ocid="admin.tournaments.tab"
            >
              Tournaments
            </TabsTrigger>
            <TabsTrigger
              value="gallery"
              className="font-display font-semibold text-sm rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
              data-ocid="admin.gallery.tab"
            >
              Gallery
            </TabsTrigger>
            <TabsTrigger
              value="siteinfo"
              className="font-display font-semibold text-sm rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
              data-ocid="admin.siteinfo.tab"
            >
              Site Info
            </TabsTrigger>
            <TabsTrigger
              value="registrations"
              className="font-display font-semibold text-sm rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
              data-ocid="admin.registrations.tab"
            >
              Registrations
            </TabsTrigger>
            <TabsTrigger
              value="players"
              className="font-display font-semibold text-sm rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
              data-ocid="admin.players.tab"
            >
              Players & Rankings
            </TabsTrigger>
            <TabsTrigger
              value="joins"
              className="font-display font-semibold text-sm rounded-none data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
              data-ocid="admin.tournament_joins.tab"
            >
              Tournament Joins
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tournaments" className="mt-0">
            <TournamentsTab />
          </TabsContent>
          <TabsContent value="gallery" className="mt-0">
            <GalleryTab />
          </TabsContent>
          <TabsContent value="siteinfo" className="mt-0">
            <SiteInfoTab />
          </TabsContent>
          <TabsContent value="registrations" className="mt-0">
            <RegistrationsTab />
          </TabsContent>
          <TabsContent value="players" className="mt-0">
            <PlayersRankingsTab />
          </TabsContent>
          <TabsContent value="joins" className="mt-0">
            <TournamentJoinsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

// ─── Main Export ──────────────────────────────────────────────────────────────

export default function AdminPage({ onBack }: AdminPageProps) {
  const { player, isInitializing } = usePlayerSession();

  if (isInitializing) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 size={32} className="animate-spin text-primary" />
      </div>
    );
  }

  if (!player || player.username !== "jaiswin") {
    return <LoginScreen onBack={onBack} />;
  }

  return <AdminCMS onBack={onBack} />;
}
