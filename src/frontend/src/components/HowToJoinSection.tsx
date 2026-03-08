import { CheckCircle2, ClipboardList, Search, Swords } from "lucide-react";

const STEPS = [
  {
    number: "01",
    icon: Search,
    title: "Find a Tournament",
    description:
      "Browse our upcoming tournaments above. Choose the game and format that suits your playstyle.",
  },
  {
    number: "02",
    icon: ClipboardList,
    title: "Register Online",
    description:
      "Click the Register button and fill in your details. Solo or team — we'll guide you through the process.",
  },
  {
    number: "03",
    icon: CheckCircle2,
    title: "Get Confirmed",
    description:
      "Our team will review your registration and send a confirmation via Discord or email within 24 hours.",
  },
  {
    number: "04",
    icon: Swords,
    title: "Compete & Win",
    description:
      "Show up, play hard, and compete for the prize pool. May the best player win!",
  },
];

export default function HowToJoinSection() {
  return (
    <section
      id="how-to-join"
      className="py-20 px-4 sm:px-6 lg:px-8 relative"
      style={{ background: "oklch(0.14 0 0)" }}
    >
      {/* Top border */}
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.62 0.23 25 / 40%), transparent)",
        }}
      />
      <div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.62 0.23 25 / 40%), transparent)",
        }}
      />

      {/* Background decoration */}
      <div className="absolute inset-0 bg-grid opacity-15" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="text-primary font-display font-semibold text-xs tracking-[0.3em] uppercase mb-3 block">
            Get Started
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-foreground neon-glow mb-4">
            HOW TO JOIN
          </h2>
          <div className="section-divider mx-auto" />
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Joining a tournament is simple. Follow these steps and you'll be
            competing in no time.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line on desktop */}
          <div
            className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-px z-0"
            style={{
              background:
                "linear-gradient(90deg, transparent, oklch(0.62 0.23 25 / 30%), oklch(0.62 0.23 25 / 30%), transparent)",
            }}
          />

          {STEPS.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative z-10 group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Card */}
                <div className="bg-card border border-border p-6 rounded-none h-full flex flex-col items-center text-center gap-4 group-hover:border-primary/50 transition-all duration-300 neon-border-hover">
                  {/* Number */}
                  <div className="relative">
                    <span
                      className="font-display font-black text-5xl leading-none select-none"
                      style={{
                        color: "oklch(0.62 0.23 25 / 15%)",
                        WebkitTextStroke: "1px oklch(0.62 0.23 25 / 30%)",
                      }}
                    >
                      {step.number}
                    </span>
                    {/* Icon overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 bg-primary/20 border border-primary/30 rounded-none flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                        <Icon size={18} className="text-primary" />
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-display font-bold text-foreground text-base mb-2 group-hover:text-primary transition-colors">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Step number label */}
                <div className="absolute -top-2 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-display font-bold px-2 py-0.5">
                    STEP {index + 1}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
