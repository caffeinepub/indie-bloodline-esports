import type { GalleryItem } from "@/hooks/useLocalStore";
import { ImageIcon } from "lucide-react";

interface GallerySectionProps {
  gallery: GalleryItem[];
}

interface GalleryCardProps {
  item: GalleryItem;
  index: number;
}

function GalleryCard({ item, index }: GalleryCardProps) {
  const ocidIndex = index + 1;

  return (
    <div
      className="group relative overflow-hidden bg-card border border-border rounded-none cursor-pointer"
      data-ocid={`gallery.item.${ocidIndex}`}
    >
      {item.image ? (
        <img
          src={item.image}
          alt={item.caption}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full min-h-48 flex items-center justify-center bg-secondary">
          <ImageIcon size={40} className="text-muted-foreground/40" />
        </div>
      )}

      {/* Caption overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-400">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <p className="text-foreground font-display font-semibold text-sm leading-tight">
            {item.caption}
          </p>
          <div className="w-8 h-0.5 bg-primary mt-2" />
        </div>
      </div>

      {/* Neon border effect */}
      <div className="absolute inset-0 border border-primary/0 group-hover:border-primary/40 transition-all duration-300" />
      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
}

export default function GallerySection({ gallery }: GallerySectionProps) {
  const sorted = [...gallery].sort((a, b) => a.sortOrder - b.sortOrder);

  return (
    <section
      id="gallery"
      className="py-20 px-4 sm:px-6 lg:px-8 relative"
      style={{ background: "oklch(0.14 0 0)" }}
    >
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

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-display font-semibold text-xs tracking-[0.3em] uppercase mb-3 block">
            Memories
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-foreground neon-glow mb-4">
            GALLERY
          </h2>
          <div className="section-divider mx-auto" />
          <p className="mt-4 text-muted-foreground max-w-lg mx-auto">
            Relive the intense moments and epic clashes from our past events
          </p>
        </div>

        {/* Gallery Grid */}
        {sorted.length === 0 ? (
          <div
            className="text-center py-20 border border-border/50 bg-card/50"
            data-ocid="gallery.empty_state"
          >
            <ImageIcon
              size={48}
              className="mx-auto mb-4 text-muted-foreground/40"
            />
            <p className="text-muted-foreground text-lg font-display font-semibold">
              No gallery items yet
            </p>
            <p className="text-muted-foreground/60 text-sm mt-2">
              Check back after our next event
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((item, index) => (
              <div
                key={item.id}
                className={`${
                  index === 0 && sorted.length >= 3
                    ? "sm:col-span-2 lg:col-span-1"
                    : ""
                } aspect-video`}
              >
                <GalleryCard item={item} index={index} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
