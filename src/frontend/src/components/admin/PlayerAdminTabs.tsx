import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { useActor } from "@/hooks/useActor";
import {
  Check,
  Loader2,
  RefreshCw,
  Swords,
  Trophy,
  Users,
  X,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import type {
  Player,
  PlayerPublic,
  PlayerStatus,
  Tournament,
} from "../../backend";

const ADMIN_KEY = "admin_local_token";

function statusLabel(status: PlayerStatus): { label: string; cls: string } {
  if ("pending" in status)
    return {
      label: "Pending",
      cls: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    };
  if ("approved" in status)
    return {
      label: "Approved",
      cls: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    };
  return {
    label: "Rejected",
    cls: "bg-destructive/20 text-destructive border-destructive/30",
  };
}

// ─── Registrations Tab ───────────────────────────────────────────────────

export function RegistrationsTab() {
  const { actor } = useActor();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<bigint | null>(null);

  const load = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const data = await actor.getPendingRegistrationsAuth(ADMIN_KEY);
      setPlayers(data);
    } catch {
      toast.error("Failed to load registrations");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    load();
  }, [load]);

  const handleApprove = async (id: bigint) => {
    if (!actor) return;
    setProcessing(id);
    try {
      await actor.approvePlayerAuth(ADMIN_KEY, id);
      toast.success("Player approved!");
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error("Failed to approve player");
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (id: bigint) => {
    if (!actor) return;
    setProcessing(id);
    try {
      await actor.rejectPlayerAuth(ADMIN_KEY, id);
      toast.success("Player rejected");
      setPlayers((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error("Failed to reject player");
    } finally {
      setProcessing(null);
    }
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="admin.registrations.loading_state"
      >
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          <Users className="text-primary" size={18} />
          Pending Registrations
          <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 rounded-none ml-2">
            {players.length}
          </Badge>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={load}
          className="rounded-none text-xs"
          data-ocid="admin.registrations.button"
        >
          <RefreshCw size={14} className="mr-1.5" /> Refresh
        </Button>
      </div>

      {players.length === 0 ? (
        <div
          className="border border-dashed border-border bg-card/30 p-12 text-center"
          data-ocid="admin.registrations.empty_state"
        >
          <Users className="text-muted-foreground mx-auto mb-3" size={32} />
          <p className="text-muted-foreground text-sm">
            No pending registrations
          </p>
        </div>
      ) : (
        <div className="border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-secondary/50">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                  Username
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                  UID
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                  Account
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                  Level
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                  Guild
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                  Status
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {players.map((p, i) => {
                const { label, cls } = statusLabel(p.status);
                const busy = processing === p.id;
                return (
                  <TableRow
                    key={Number(p.id)}
                    className="border-border"
                    data-ocid={`admin.registrations.row.${i + 1}`}
                  >
                    <TableCell className="font-display font-bold text-foreground">
                      {p.username}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {p.uid}
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-sm text-muted-foreground">
                      {p.gameAccountType}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge className="bg-primary/20 text-primary border-primary/30 rounded-none text-xs">
                        {p.gameplayLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {p.guildName || "—"}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${cls} rounded-none text-xs border`}>
                        {label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          disabled={busy}
                          onClick={() => handleApprove(p.id)}
                          className="bg-emerald-500/20 hover:bg-emerald-500/40 text-emerald-400 border border-emerald-500/30 rounded-none text-xs h-7 px-2"
                          data-ocid={`admin.registrations.confirm_button.${i + 1}`}
                        >
                          {busy ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <Check size={12} />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          disabled={busy}
                          onClick={() => handleReject(p.id)}
                          className="bg-destructive/20 hover:bg-destructive/40 text-destructive border border-destructive/30 rounded-none text-xs h-7 px-2"
                          data-ocid={`admin.registrations.delete_button.${i + 1}`}
                        >
                          {busy ? (
                            <Loader2 size={12} className="animate-spin" />
                          ) : (
                            <X size={12} />
                          )}
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
    </div>
  );
}

// ─── Players & Rankings Tab ────────────────────────────────────────────────

export function PlayersRankingsTab() {
  const { actor } = useActor();
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [rankInputs, setRankInputs] = useState<Record<string, string>>({});
  const [winsInputs, setWinsInputs] = useState<Record<string, string>>({});
  const [topInputs, setTopInputs] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState<bigint | null>(null);

  const load = useCallback(async () => {
    if (!actor) return;
    setLoading(true);
    try {
      const data = await actor.getAllPlayersAuth(ADMIN_KEY);
      setPlayers(data);
      const ranks: Record<string, string> = {};
      const wins: Record<string, string> = {};
      const tops: Record<string, string> = {};
      for (const p of data) {
        const key = String(p.id);
        ranks[key] = String(Number(p.rank));
        wins[key] = String(Number(p.wins));
        tops[key] = String(Number(p.topPlacements));
      }
      setRankInputs(ranks);
      setWinsInputs(wins);
      setTopInputs(tops);
    } catch {
      toast.error("Failed to load players");
    } finally {
      setLoading(false);
    }
  }, [actor]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSaveRank = async (p: Player) => {
    if (!actor) return;
    setSaving(p.id);
    const key = String(p.id);
    try {
      const rank = BigInt(Number(rankInputs[key]) || 0);
      const wins = BigInt(Number(winsInputs[key]) || 0);
      const tops = BigInt(Number(topInputs[key]) || 0);
      await Promise.all([
        actor.setPlayerRankingAuth(ADMIN_KEY, p.id, rank),
        actor.updatePlayerStatsAuth(ADMIN_KEY, p.id, wins, tops),
      ]);
      toast.success(`Updated ${p.username}`);
    } catch {
      toast.error("Failed to update player");
    } finally {
      setSaving(null);
    }
  };

  if (loading) {
    return (
      <div
        className="flex items-center justify-center py-16"
        data-ocid="admin.players.loading_state"
      >
        <Loader2 className="animate-spin text-primary" size={28} />
      </div>
    );
  }

  const approved = players.filter((p) => "approved" in p.status);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
          <Trophy className="text-primary" size={18} />
          Players & Rankings
          <Badge variant="outline" className="rounded-none ml-2">
            {approved.length}
          </Badge>
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={load}
          className="rounded-none text-xs"
          data-ocid="admin.players.button"
        >
          <RefreshCw size={14} className="mr-1.5" /> Refresh
        </Button>
      </div>

      {approved.length === 0 ? (
        <div
          className="border border-dashed border-border bg-card/30 p-12 text-center"
          data-ocid="admin.players.empty_state"
        >
          <Trophy className="text-muted-foreground mx-auto mb-3" size={32} />
          <p className="text-muted-foreground text-sm">
            No approved players yet
          </p>
        </div>
      ) : (
        <div className="border border-border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="border-border bg-secondary/50">
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                  Player
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                  Level
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                  Rank
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                  Wins
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                  Top
                </TableHead>
                <TableHead className="text-xs uppercase tracking-wider text-muted-foreground text-right">
                  Save
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approved.map((p, i) => {
                const key = String(p.id);
                const busy = saving === p.id;
                return (
                  <TableRow
                    key={Number(p.id)}
                    className="border-border"
                    data-ocid={`admin.players.row.${i + 1}`}
                  >
                    <TableCell>
                      <div className="font-display font-bold text-foreground">
                        {p.username}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {p.uid}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className="bg-primary/20 text-primary border-primary/30 rounded-none text-xs">
                        {p.gameplayLevel}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={rankInputs[key] ?? "0"}
                        onChange={(e) =>
                          setRankInputs((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="bg-secondary border-border rounded-none h-8 w-20 font-mono text-sm"
                        data-ocid={`admin.players.input.${i + 1}`}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={winsInputs[key] ?? "0"}
                        onChange={(e) =>
                          setWinsInputs((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="bg-secondary border-border rounded-none h-8 w-20 font-mono text-sm"
                        data-ocid={`admin.players.input.${i + 1}`}
                      />
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Input
                        type="number"
                        min="0"
                        value={topInputs[key] ?? "0"}
                        onChange={(e) =>
                          setTopInputs((prev) => ({
                            ...prev,
                            [key]: e.target.value,
                          }))
                        }
                        className="bg-secondary border-border rounded-none h-8 w-20 font-mono text-sm"
                        data-ocid={`admin.players.input.${i + 1}`}
                      />
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        size="sm"
                        disabled={busy}
                        onClick={() => handleSaveRank(p)}
                        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none text-xs h-8"
                        data-ocid={`admin.players.save_button.${i + 1}`}
                      >
                        {busy ? (
                          <Loader2 size={12} className="animate-spin" />
                        ) : (
                          "Save"
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

// ─── Tournament Joins Tab ───────────────────────────────────────────────────

export function TournamentJoinsTab() {
  const { actor } = useActor();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedId, setSelectedId] = useState<string>("");
  const [joinPlayers, setJoinPlayers] = useState<PlayerPublic[]>([]);
  const [loadingT, setLoadingT] = useState(true);
  const [loadingP, setLoadingP] = useState(false);

  useEffect(() => {
    if (!actor) return;
    actor
      .getTournaments()
      .then(setTournaments)
      .finally(() => setLoadingT(false));
  }, [actor]);

  const handleSelectTournament = async (id: string) => {
    setSelectedId(id);
    if (!id || !actor) return;
    setLoadingP(true);
    try {
      const data = await actor.getTournamentJoinRequestsAuth(
        ADMIN_KEY,
        BigInt(id),
      );
      setJoinPlayers(data);
    } catch {
      toast.error("Failed to load join requests");
    } finally {
      setLoadingP(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="font-display font-bold text-lg text-foreground flex items-center gap-2">
        <Swords className="text-primary" size={18} />
        Tournament Join Requests
      </h2>

      <div className="max-w-sm">
        <Select
          value={selectedId}
          onValueChange={handleSelectTournament}
          disabled={loadingT}
        >
          <SelectTrigger
            className="bg-secondary border-border rounded-none"
            data-ocid="admin.tournament_joins.select"
          >
            <SelectValue
              placeholder={
                loadingT ? "Loading tournaments..." : "Select a tournament"
              }
            />
          </SelectTrigger>
          <SelectContent className="bg-card border-border rounded-none">
            {tournaments.map((t) => (
              <SelectItem
                key={String(t.id)}
                value={String(t.id)}
                className="rounded-none"
              >
                {t.title}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedId &&
        (loadingP ? (
          <div
            className="flex items-center justify-center py-12"
            data-ocid="admin.tournament_joins.loading_state"
          >
            <Loader2 className="animate-spin text-primary" size={24} />
          </div>
        ) : joinPlayers.length === 0 ? (
          <div
            className="border border-dashed border-border bg-card/30 p-12 text-center"
            data-ocid="admin.tournament_joins.empty_state"
          >
            <Users className="text-muted-foreground mx-auto mb-3" size={32} />
            <p className="text-muted-foreground text-sm">
              No players have joined this tournament yet
            </p>
          </div>
        ) : (
          <div className="border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-secondary/50">
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    #
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Player
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                    Level
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                    Guild
                  </TableHead>
                  <TableHead className="text-xs uppercase tracking-wider text-muted-foreground">
                    Rank
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {joinPlayers.map((p, i) => (
                  <TableRow
                    key={Number(p.id)}
                    className="border-border"
                    data-ocid={`admin.tournament_joins.row.${i + 1}`}
                  >
                    <TableCell className="font-mono text-sm text-muted-foreground">
                      {i + 1}
                    </TableCell>
                    <TableCell>
                      <div className="font-display font-bold text-foreground">
                        {p.username}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {p.uid}
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <Badge className="bg-primary/20 text-primary border-primary/30 rounded-none text-xs">
                        {p.gameplayLevel}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                      {p.guildName || "—"}
                    </TableCell>
                    <TableCell className="font-mono font-bold text-sm">
                      {Number(p.rank) > 0 ? `#${Number(p.rank)}` : "—"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
    </div>
  );
}
