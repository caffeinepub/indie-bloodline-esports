import type { SiteInfo } from "@/hooks/useLocalStore";
import { Target, Trophy, Users, Zap } from "lucide-react";

interface AboutSectionProps {
  siteInfo: SiteInfo;
}

const STATS = [
  { icon: Trophy, value: "30+", label: "Tournaments Hosted" },
  { icon: Users, value: "500+", label: "Players Registered" },
  { icon: Zap, value: "3+", label: "Game Titles" },
  { icon: Target, value: "100%", label: "Passion Driven" },
];

export default function AboutSection({ siteInfo }: AboutSectionProps) {
  return (
    <section
      id="about"
      className="py-20 px-4 sm:px-6 lg:px-8 relative"
      data-ocid="about.section"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.62 0.23 25 / 40%), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Text Content */}
          <div>
            <span className="text-primary font-display font-semibold text-xs tracking-[0.3em] uppercase mb-3 block">
              Our Story
            </span>
            <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-foreground neon-glow mb-6">
              ABOUT US
            </h2>
            <div className="section-divider mb-8" />

            <div className="space-y-6">
              <p className="text-muted-foreground leading-relaxed text-base">
                {siteInfo.aboutText}
              </p>

              <div className="border-l-2 border-primary pl-4 py-1">
                <p className="text-foreground/80 leading-relaxed text-base italic">
                  "{siteInfo.missionText}"
                </p>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4 mt-10">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="bg-card border border-border p-4 rounded-none group hover:border-primary/50 transition-all"
                  >
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 bg-primary/20 border border-primary/30 flex items-center justify-center rounded-none group-hover:bg-primary/30 transition-colors">
                        <Icon size={14} className="text-primary" />
                      </div>
                      <span className="font-display font-black text-2xl text-primary neon-glow">
                        {stat.value}
                      </span>
                    </div>
                    <p className="text-muted-foreground text-xs uppercase tracking-wider">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            {/* Main image */}
            <div className="relative aspect-square max-w-md mx-auto">
              {/* Background geometric decoration */}
              <div
                className="absolute -inset-4 border border-primary/20 rounded-none z-0"
                style={{
                  background:
                    "radial-gradient(ellipse at center, oklch(0.62 0.23 25 / 5%), transparent 70%)",
                }}
              />

              {/* Red accent squares */}
              <div className="absolute -top-2 -right-2 w-16 h-16 border-2 border-primary/50 z-10" />
              <div className="absolute -bottom-2 -left-2 w-12 h-12 border-2 border-primary/30 z-10" />

              {/* Logo centered */}
              <div className="relative z-5 w-full h-full bg-card/80 border border-border flex flex-col items-center justify-center gap-6 p-8">
                <img
                  src="/assets/generated/logo-transparent.dim_400x400.png"
                  alt="Indie Bloodline Esports"
                  className="w-40 h-40 object-contain"
                />
                <div className="text-center">
                  <div className="font-display font-black text-2xl text-foreground tracking-wider">
                    <span className="text-primary neon-glow">INDIE</span>{" "}
                    BLOODLINE
                  </div>
                  <div className="font-display font-semibold text-sm text-muted-foreground tracking-[0.3em] mt-1 uppercase">
                    Esports
                  </div>
                </div>

                {/* Decorative bars */}
                <div className="flex gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div
                      key={i}
                      className="w-1.5 rounded-sm bg-primary"
                      style={{
                        height: `${10 + i * 6}px`,
                        opacity: 0.4 + i * 0.1,
                      }}
                    />
                  ))}
                  {[5, 4, 3, 2, 1].map((i) => (
                    <div
                      key={`r${i}`}
                      className="w-1.5 rounded-sm bg-primary"
                      style={{
                        height: `${10 + i * 6}px`,
                        opacity: 0.4 + i * 0.1,
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
