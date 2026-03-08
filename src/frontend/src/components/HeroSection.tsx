import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef } from "react";
import { SiDiscord } from "react-icons/si";

function scrollToSection(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

// Particle data generated once
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left: `${(i * 17 + 5) % 95}%`,
  top: `${(i * 23 + 10) % 85}%`,
  size: 2 + (i % 4),
  delay: `${(i * 0.3) % 3}s`,
  duration: `${3 + (i % 4)}s`,
  opacity: 0.2 + (i % 5) * 0.1,
}));

export default function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      hero.style.setProperty("--mouse-x", `${x}%`);
      hero.style.setProperty("--mouse-y", `${y}%`);
    };

    hero.addEventListener("mousemove", handleMouseMove);
    return () => hero.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <section
      id="home"
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={
        {
          "--mouse-x": "50%",
          "--mouse-y": "50%",
        } as React.CSSProperties
      }
    >
      {/* Background image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/assets/generated/hero-bg.dim_1920x1080.jpg"
          alt=""
          className="w-full h-full object-cover"
          loading="eager"
        />
        {/* Multi-layer overlay */}
        <div className="absolute inset-0 bg-background/80" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/50 via-transparent to-background/50" />
        {/* Vignette */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 30%, oklch(0.12 0 0 / 70%) 100%)",
          }}
        />
      </div>

      {/* Background grid */}
      <div className="absolute inset-0 z-1 bg-grid opacity-30" />

      {/* Floating particles */}
      <div className="absolute inset-0 z-2 pointer-events-none">
        {PARTICLES.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-primary"
            style={{
              left: p.left,
              top: p.top,
              width: p.size,
              height: p.size,
              opacity: p.opacity,
              animation: `particle-float ${p.duration} ${p.delay} ease-in-out infinite`,
            }}
          />
        ))}
      </div>

      {/* Red accent glow at bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-32 z-2 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at center bottom, oklch(0.62 0.23 25 / 25%), transparent 70%)",
        }}
      />

      {/* Main content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
        {/* Pre-title */}
        <div className="mb-4 flex items-center justify-center gap-3">
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-primary" />
          <span className="text-primary font-display font-semibold text-xs sm:text-sm tracking-[0.3em] uppercase">
            Indie
          </span>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-primary" />
        </div>

        {/* Main headline */}
        <h1 className="font-display font-black leading-none mb-2">
          <div
            className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] text-foreground neon-glow animate-flicker"
            style={{ letterSpacing: "-0.02em" }}
          >
            BLOODLINE
          </div>
          <div
            className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl text-primary tracking-[0.1em]"
            style={{ marginTop: "-0.1em" }}
          >
            ESPORTS
          </div>
        </h1>

        {/* Divider line */}
        <div className="my-6 flex items-center justify-center gap-4">
          <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-primary/50" />
          <div className="w-2 h-2 rotate-45 bg-primary" />
          <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-primary/50" />
        </div>

        {/* Tagline */}
        <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground font-body font-light tracking-wide mb-10 max-w-2xl mx-auto">
          Where Legends Are Forged.{" "}
          <span className="text-foreground/80">Where Champions Rise.</span>
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={() => scrollToSection("tournaments")}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground font-display font-bold text-base px-8 py-6 rounded-none neon-border transition-all duration-300 hover:scale-105"
            data-ocid="hero.primary_button"
          >
            View Tournaments
          </Button>
          <Button
            size="lg"
            variant="outline"
            asChild
            className="w-full sm:w-auto border-foreground/30 hover:border-primary text-foreground hover:text-primary font-display font-semibold text-base px-8 py-6 rounded-none transition-all duration-300 hover:bg-primary/10"
            data-ocid="hero.secondary_button"
          >
            <a
              href="https://discord.gg/indiebloodline"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2"
            >
              <SiDiscord size={18} />
              Join Discord
            </a>
          </Button>
        </div>

        {/* Stats row */}
        <div className="mt-16 grid grid-cols-3 gap-4 max-w-md mx-auto">
          {[
            { value: "30+", label: "Tournaments" },
            { value: "500+", label: "Players" },
            { value: "3+", label: "Game Titles" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-display font-black text-primary neon-glow">
                {stat.value}
              </div>
              <div className="text-xs text-muted-foreground uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <button
        type="button"
        onClick={() => scrollToSection("tournaments")}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-muted-foreground hover:text-primary transition-colors animate-bounce"
        aria-label="Scroll to tournaments"
      >
        <ChevronDown size={28} />
      </button>
    </section>
  );
}
