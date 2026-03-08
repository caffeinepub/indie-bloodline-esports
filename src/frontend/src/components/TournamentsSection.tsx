import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Tournament } from "@/hooks/useLocalStore";
import { Calendar, ExternalLink, Gamepad2, Trophy } from "lucide-react";
import { useState } from "react";

type FilterStatus = "all" | "upcoming" | "ongoing" | "completed";

const STATUS_CONFIG = {
  upcoming: {
    label: "Upcoming",
    className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  },
  ongoing: {
    label: "Live",
    className:
      "bg-yellow-500/20 text-yellow-400 border-yellow-500/30 animate-pulse",
  },
  completed: {
    label: "Completed",
    className: "bg-muted/50 text-muted-foreground border-border",
  },
};

interface TournamentCardProps {
  tournament: Tournament;
  index: number;
}

function TournamentCard({ tournament, index }: TournamentCardProps) {
  const status = STATUS_CONFIG[tournament.status];
  const ocidIndex = index + 1;

  return (
    <article
      className="group relative bg-card border border-border rounded-none overflow-hidden card-hover neon-border-hover"
      data-ocid={`tournaments.item.${ocidIndex}`}
    >
      {/* Banner Image */}
      <div className="relative aspect-video overflow-hidden bg-secondary">
        {tournament.bannerImage ? (
          <img
            src={tournament.bannerImage}
            alt={`${tournament.title} banner`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <Gamepad2 size={40} className="text-muted-foreground/40" />
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent" />

        {/* Game badge */}
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="bg-background/90 text-foreground border-border text-xs font-semibold uppercase tracking-wide"
          >
            {tournament.game}
          </Badge>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 right-3">
          <Badge
            variant="outline"
            className={`text-xs font-semibold ${status.className}`}
          >
            {status.label}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col gap-3">
        <h3 className="font-display font-bold text-foreground text-base leading-tight group-hover:text-primary transition-colors line-clamp-2">
          {tournament.title}
        </h3>

        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar size={13} className="text-primary flex-shrink-0" />
            <span>{tournament.date}</span>
          </div>
          <div className="flex items-center gap-2">
            <Trophy size={13} className="text-primary flex-shrink-0" />
            <span>
              Prize Pool:{" "}
              <span className="text-foreground font-semibold">
                {tournament.prizePool}
              </span>
            </span>
          </div>
        </div>

        {/* Action */}
        {(tournament.status === "upcoming" ||
          tournament.status === "ongoing") &&
          tournament.registrationUrl && (
            <Button
              size="sm"
              asChild
              className="w-full mt-1 bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-xs rounded-none neon-border transition-all"
              data-ocid={`tournaments.register_button.${ocidIndex}`}
            >
              <a
                href={tournament.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2"
              >
                Register Now
                <ExternalLink size={11} />
              </a>
            </Button>
          )}

        {tournament.status === "completed" && (
          <div className="mt-1 text-center text-xs text-muted-foreground py-2 border border-border/50 rounded-sm">
            Tournament Ended
          </div>
        )}
      </div>

      {/* Neon bottom border on hover */}
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </article>
  );
}

interface TournamentsSectionProps {
  tournaments: Tournament[];
}

export default function TournamentsSection({
  tournaments,
}: TournamentsSectionProps) {
  const [activeFilter, setActiveFilter] = useState<FilterStatus>("all");

  const filters: { key: FilterStatus; label: string }[] = [
    { key: "all", label: "All" },
    { key: "upcoming", label: "Upcoming" },
    { key: "ongoing", label: "Live" },
    { key: "completed", label: "Completed" },
  ];

  const filtered =
    activeFilter === "all"
      ? tournaments
      : tournaments.filter((t) => t.status === activeFilter);

  const sorted = [...filtered].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section id="tournaments" className="py-20 px-4 sm:px-6 lg:px-8 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-grid opacity-20" />
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.62 0.23 25 / 50%), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-display font-semibold text-xs tracking-[0.3em] uppercase mb-3 block">
            Compete & Win
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-foreground neon-glow mb-4">
            TOURNAMENTS
          </h2>
          <div className="section-divider mx-auto" />
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Join our professionally managed tournaments and prove your skills
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center justify-center gap-2 mb-10 flex-wrap">
          {filters.map((filter) => (
            <button
              type="button"
              key={filter.key}
              onClick={() => setActiveFilter(filter.key)}
              className={`px-5 py-2 text-sm font-display font-semibold uppercase tracking-wider transition-all duration-200 border rounded-none ${
                activeFilter === filter.key
                  ? "bg-primary text-primary-foreground border-primary neon-border"
                  : "bg-transparent text-muted-foreground border-border hover:border-primary/50 hover:text-foreground"
              }`}
              data-ocid="tournaments.tab"
            >
              {filter.label}
              {filter.key !== "all" && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({tournaments.filter((t) => t.status === filter.key).length})
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Grid or Empty State */}
        {sorted.length === 0 ? (
          <div
            className="text-center py-20 border border-border/50 bg-card/50 rounded-none"
            data-ocid="tournaments.empty_state"
          >
            <Gamepad2
              size={48}
              className="mx-auto mb-4 text-muted-foreground/40"
            />
            <p className="text-muted-foreground text-lg font-display font-semibold">
              No tournaments found
            </p>
            <p className="text-muted-foreground/60 text-sm mt-2">
              Check back soon for upcoming events
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sorted.map((tournament, index) => (
              <TournamentCard
                key={tournament.id}
                tournament={tournament}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
