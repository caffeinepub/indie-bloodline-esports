import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useActor } from "@/hooks/useActor";
import { usePlayerSession } from "@/hooks/usePlayerSession";
import {
  Calendar,
  Crown,
  Loader2,
  LogOut,
  Shield,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import type { Tournament } from "../backend";

interface PlayerDashboardPageProps {
  onLogout: () => void;
  onProfileClick?: (playerId: bigint) => void;
}

export default function PlayerDashboardPage({
  onLogout,
  onProfileClick: _onProfileClick,
}: PlayerDashboardPageProps) {
  const { player, logout, refreshPlayer } = usePlayerSession();
  const { actor } = useActor();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loadingTournaments, setLoadingTournaments] = useState(true);
  const [joiningId, setJoiningId] = useState<bigint | null>(null);

  useEffect(() => {
    if (!actor) return;
    actor
      .getTournaments()
      .then(setTournaments)
      .catch(() => toast.error("Failed to load tournaments"))
      .finally(() => setLoadingTournaments(false));
  }, [actor]);

  const handleLogout = () => {
    logout();
    onLogout();
  };

  const handleJoin = async (tournamentId: bigint) => {
    const token = localStorage.getItem("player_token");
    if (!token || !actor) return;
    setJoiningId(tournamentId);
    try {
      const ok = await actor.joinTournament(token, tournamentId);
      if (ok) {
        toast.success("Successfully joined tournament!");
        await refreshPlayer();
      } else {
        toast.error("Could not join tournament.");
      }
    } catch {
      toast.error("Error joining tournament.");
    } finally {
      setJoiningId(null);
    }
  };

  const liveTournaments = tournaments.filter((t) => t.status === "ongoing");
  const upcomingTournaments = tournaments.filter(
    (t) => t.status === "upcoming",
  );
  const pastTournaments = tournaments.filter((t) => t.status === "completed");

  const isJoined = (id: bigint) =>
    player?.tournamentsJoined.some((tid) => tid === id) ?? false;

  if (!player) {
    return (
      <div
        className="min-h-screen bg-background flex items-center justify-center"
        data-ocid="dashboard.loading_state"
      >
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid opacity-10" />

      {/* Header */}
      <header className="relative z-10 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/logo-transparent.dim_400x400.png"
              alt="IBE"
              className="w-8 h-8 object-cover"
            />
            <span className="font-display font-black text-sm tracking-wider">
              <span className="text-primary">INDIE</span>{" "}
              <span className="text-foreground">BLOODLINE</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-muted-foreground hidden sm:block">
              Welcome,{" "}
              <span className="text-foreground font-semibold">
                {player.username}
              </span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-foreground rounded-none text-xs"
              data-ocid="dashboard.logout_button"
            >
              <LogOut size={14} className="mr-1.5" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Player Card */}
        <div className="border border-border bg-card/60 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-start gap-6">
            <div className="w-16 h-16 bg-primary/20 border-2 border-primary/40 flex items-center justify-center flex-shrink-0">
              <Shield className="text-primary" size={28} />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-3 mb-2">
                <h1 className="font-display font-black text-2xl sm:text-3xl text-foreground">
                  {player.username}
                </h1>
                {Number(player.rank) > 0 ? (
                  <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30 rounded-none font-mono font-bold">
                    <Crown size={12} className="mr-1" />
                    RANK #{Number(player.rank)}
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="rounded-none text-muted-foreground"
                  >
                    UNRANKED
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-primary/20 text-primary border-primary/30 rounded-none text-xs uppercase tracking-wider">
                  {player.gameplayLevel}
                </Badge>
                {player.guildName && (
                  <Badge variant="outline" className="rounded-none text-xs">
                    <Users size={10} className="mr-1" />
                    {player.guildName}
                  </Badge>
                )}
                {player.playStyles.map((style) => (
                  <Badge
                    key={style}
                    variant="secondary"
                    className="rounded-none text-xs"
                  >
                    {style}
                  </Badge>
                ))}
              </div>
              {/* Stats Row */}
              <div className="grid grid-cols-3 gap-4 max-w-sm">
                <div className="text-center">
                  <div className="font-display font-black text-2xl text-primary">
                    {Number(player.wins)}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Wins
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-display font-black text-2xl text-foreground">
                    {Number(player.topPlacements)}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Top Places
                  </div>
                </div>
                <div className="text-center">
                  <div className="font-display font-black text-2xl text-foreground">
                    {player.tournamentsJoined.length}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider">
                    Joined
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tournaments */}
        <div>
          <h2 className="font-display font-black text-xl text-foreground mb-4 flex items-center gap-2">
            <Swords className="text-primary" size={20} />
            TOURNAMENTS
          </h2>

          {loadingTournaments ? (
            <div className="space-y-3" data-ocid="dashboard.loading_state">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-24 rounded-none" />
              ))}
            </div>
          ) : (
            <Tabs defaultValue="upcoming">
              <TabsList className="bg-secondary border border-border rounded-none h-auto p-1 gap-1 mb-4">
                <TabsTrigger
                  value="live"
                  className="rounded-none font-display font-semibold text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
                  data-ocid="dashboard.tab"
                >
                  LIVE ({liveTournaments.length})
                </TabsTrigger>
                <TabsTrigger
                  value="upcoming"
                  className="rounded-none font-display font-semibold text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
                  data-ocid="dashboard.tab"
                >
                  UPCOMING ({upcomingTournaments.length})
                </TabsTrigger>
                <TabsTrigger
                  value="past"
                  className="rounded-none font-display font-semibold text-xs data-[state=active]:bg-primary data-[state=active]:text-primary-foreground px-4 py-2"
                  data-ocid="dashboard.tab"
                >
                  PAST ({pastTournaments.length})
                </TabsTrigger>
              </TabsList>

              {(["live", "upcoming", "past"] as const).map((tabKey, idx) => {
                const list = [
                  liveTournaments,
                  upcomingTournaments,
                  pastTournaments,
                ][idx];
                return (
                  <TabsContent key={tabKey} value={tabKey}>
                    {list.length === 0 ? (
                      <div
                        className="border border-dashed border-border bg-card/30 p-12 text-center"
                        data-ocid="dashboard.empty_state"
                      >
                        <Trophy
                          className="text-muted-foreground mx-auto mb-3"
                          size={32}
                        />
                        <p className="text-muted-foreground text-sm">
                          No {tabKey} tournaments
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {list.map((t, i) => (
                          <TournamentCard
                            key={Number(t.id)}
                            tournament={t}
                            index={i + 1}
                            joined={isJoined(t.id)}
                            canJoin={tabKey !== "past"}
                            joining={joiningId === t.id}
                            onJoin={() => handleJoin(t.id)}
                          />
                        ))}
                      </div>
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}

function TournamentCard({
  tournament,
  index,
  joined,
  canJoin,
  joining,
  onJoin,
}: {
  tournament: Tournament;
  index: number;
  joined: boolean;
  canJoin: boolean;
  joining: boolean;
  onJoin: () => void;
}) {
  const statusColors: Record<string, string> = {
    upcoming: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
    ongoing: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    completed: "bg-muted/50 text-muted-foreground border-border",
  };

  return (
    <div
      className="border border-border bg-card/60 p-4 flex flex-col sm:flex-row sm:items-center gap-4"
      data-ocid={`dashboard.item.${index}`}
    >
      <div className="flex-1">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <h3 className="font-display font-bold text-foreground">
            {tournament.title}
          </h3>
          <Badge
            className={`${statusColors[tournament.status] || ""} rounded-none text-xs border uppercase`}
          >
            {tournament.status}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Swords size={10} />
            {tournament.game}
          </span>
          <span className="flex items-center gap-1">
            <Calendar size={10} />
            {tournament.date}
          </span>
          <span className="flex items-center gap-1">
            <Trophy size={10} />
            {tournament.prizePool}
          </span>
        </div>
      </div>
      {canJoin &&
        (joined ? (
          <Badge className="bg-primary/20 text-primary border-primary/30 rounded-none text-xs">
            JOINED
          </Badge>
        ) : (
          <Button
            size="sm"
            onClick={onJoin}
            disabled={joining}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-none font-display font-bold tracking-wider text-xs"
            data-ocid={`dashboard.item.${index}`}
          >
            {joining ? <Loader2 className="h-3 w-3 animate-spin" /> : "JOIN"}
          </Button>
        ))}
    </div>
  );
}
