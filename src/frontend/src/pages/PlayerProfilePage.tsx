import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useActor } from "@/hooks/useActor";
import { ChevronLeft, Crown, Shield, Trophy, Users } from "lucide-react";
import { useEffect, useState } from "react";
import type { PlayerPublic } from "../backend";

interface PlayerProfilePageProps {
  playerId: bigint;
  onBack: () => void;
}

export default function PlayerProfilePage({
  playerId,
  onBack,
}: PlayerProfilePageProps) {
  const { actor } = useActor();
  const [player, setPlayer] = useState<PlayerPublic | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!actor) return;
    actor
      .getPlayerProfile(playerId)
      .then((result) => {
        if (result.length > 0) {
          setPlayer(result[0] ?? null);
        } else {
          setNotFound(true);
        }
      })
      .finally(() => setLoading(false));
  }, [actor, playerId]);

  return (
    <div className="min-h-screen bg-background">
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 py-12">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground text-sm mb-8 transition-colors"
          data-ocid="player_profile.back_button"
        >
          <ChevronLeft size={16} />
          Back
        </button>

        {loading ? (
          <div className="space-y-6" data-ocid="player_profile.loading_state">
            <Skeleton className="h-48 rounded-none" />
            <Skeleton className="h-32 rounded-none" />
          </div>
        ) : notFound ? (
          <div
            className="border border-dashed border-border bg-card/30 p-16 text-center"
            data-ocid="player_profile.error_state"
          >
            <Shield className="text-muted-foreground mx-auto mb-3" size={40} />
            <p className="text-muted-foreground">Player not found.</p>
          </div>
        ) : player ? (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="border border-border bg-card/60 p-6 sm:p-8">
              <div className="flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="w-20 h-20 bg-primary/20 border-2 border-primary/40 flex items-center justify-center flex-shrink-0">
                  <Shield className="text-primary" size={32} />
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <h1 className="font-display font-black text-3xl text-foreground">
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
                  <div className="text-xs text-muted-foreground font-mono mb-3">
                    UID: {player.uid}
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
                    <Badge
                      variant="outline"
                      className="rounded-none text-xs capitalize"
                    >
                      {player.gameAccountType}
                    </Badge>
                  </div>
                  {player.gameplayDescription && (
                    <p className="text-sm text-muted-foreground italic">
                      "{player.gameplayDescription}"
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  label: "Wins",
                  value: Number(player.wins),
                  icon: Trophy,
                  color: "text-primary",
                },
                {
                  label: "Top Placements",
                  value: Number(player.topPlacements),
                  icon: Crown,
                  color: "text-yellow-400",
                },
                {
                  label: "Tournaments",
                  value: player.tournamentsJoined.length,
                  icon: Shield,
                  color: "text-foreground",
                },
              ].map(({ label, value, icon: Icon, color }) => (
                <div
                  key={label}
                  className="border border-border bg-card/60 p-4 text-center"
                >
                  <Icon className={`${color} mx-auto mb-2`} size={20} />
                  <div className={`font-display font-black text-2xl ${color}`}>
                    {value}
                  </div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                    {label}
                  </div>
                </div>
              ))}
            </div>

            {/* Play Styles */}
            {player.playStyles.length > 0 && (
              <div className="border border-border bg-card/60 p-6">
                <h3 className="font-display font-bold text-sm text-primary uppercase tracking-widest mb-4 border-b border-border pb-2">
                  Play Styles
                </h3>
                <div className="flex flex-wrap gap-2">
                  {player.playStyles.map((style) => (
                    <Badge
                      key={style}
                      variant="secondary"
                      className="rounded-none text-sm px-3 py-1"
                    >
                      {style}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
