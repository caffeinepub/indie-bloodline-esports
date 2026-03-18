import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActor } from "@/hooks/useActor";
import { ChevronLeft, Crown, Medal, Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import type { PlayerPublic } from "../backend";

interface LeaderboardPageProps {
  onBack: () => void;
  onPlayerClick?: (playerId: bigint) => void;
}

export default function LeaderboardPage({
  onBack,
  onPlayerClick,
}: LeaderboardPageProps) {
  const { actor } = useActor();
  const [players, setPlayers] = useState<PlayerPublic[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!actor) return;
    actor
      .getLeaderboard()
      .then((data) => setPlayers(data.filter((p) => Number(p.rank) > 0)))
      .finally(() => setLoading(false));
  }, [actor]);

  const rankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="text-yellow-400" size={16} />;
    if (rank === 2) return <Medal className="text-zinc-300" size={16} />;
    if (rank === 3) return <Medal className="text-amber-600" size={16} />;
    return (
      <span className="text-muted-foreground font-mono text-sm">#{rank}</span>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors"
          data-ocid="leaderboard.back_button"
        >
          <ChevronLeft size={16} />
          Back to Home
        </button>

        <div className="flex items-center gap-3 mb-8">
          <Trophy className="text-primary" size={32} />
          <div>
            <h1 className="font-display font-black text-4xl text-foreground">
              LEADER<span className="text-primary">BOARD</span>
            </h1>
            <p className="text-muted-foreground text-sm">
              Top ranked players in Indie Bloodline Esports
            </p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-3" data-ocid="leaderboard.loading_state">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 rounded-none" />
            ))}
          </div>
        ) : players.length === 0 ? (
          <div
            className="border border-dashed border-border bg-card/30 p-16 text-center"
            data-ocid="leaderboard.empty_state"
          >
            <Trophy className="text-muted-foreground mx-auto mb-3" size={40} />
            <p className="text-muted-foreground">
              No ranked players yet. Check back after tournaments begin.
            </p>
          </div>
        ) : (
          <div className="border border-border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="border-border bg-secondary/50">
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground w-16">
                    Rank
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground">
                    Player
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground hidden sm:table-cell">
                    Level
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                    Guild
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground text-right">
                    Wins
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground text-right hidden sm:table-cell">
                    Top Places
                  </TableHead>
                  <TableHead className="font-display font-bold text-xs uppercase tracking-wider text-muted-foreground hidden lg:table-cell">
                    Play Styles
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {players.map((p, i) => (
                  <TableRow
                    key={Number(p.id)}
                    className="border-border hover:bg-primary/5 cursor-pointer transition-colors"
                    onClick={() => onPlayerClick?.(p.id)}
                    data-ocid={`leaderboard.row.${i + 1}`}
                  >
                    <TableCell>
                      <div className="flex items-center justify-center w-8">
                        {rankIcon(Number(p.rank))}
                      </div>
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
                    <TableCell className="text-sm text-muted-foreground hidden md:table-cell">
                      {p.guildName || "—"}
                    </TableCell>
                    <TableCell className="text-right font-display font-bold text-primary">
                      {Number(p.wins)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-sm hidden sm:table-cell">
                      {Number(p.topPlacements)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {p.playStyles.map((style) => (
                          <Badge
                            key={style}
                            variant="secondary"
                            className="rounded-none text-xs"
                          >
                            {style}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
