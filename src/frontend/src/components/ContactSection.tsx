import type { SiteInfo } from "@/hooks/useLocalStore";
import { Mail, Phone } from "lucide-react";
import {
  SiDiscord,
  SiFacebook,
  SiInstagram,
  SiX,
  SiYoutube,
} from "react-icons/si";

interface ContactSectionProps {
  siteInfo: SiteInfo;
  onAdminClick: () => void;
}

const SOCIAL_CONFIG = [
  {
    key: "facebook",
    label: "Facebook",
    icon: SiFacebook,
    colorClass:
      "hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400",
    getUrl: (s: SiteInfo) => s.facebookUrl,
  },
  {
    key: "discord",
    label: "Discord",
    icon: SiDiscord,
    colorClass:
      "hover:border-indigo-500/50 hover:bg-indigo-500/10 hover:text-indigo-400",
    getUrl: (s: SiteInfo) => s.discordUrl,
  },
  {
    key: "youtube",
    label: "YouTube",
    icon: SiYoutube,
    colorClass:
      "hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400",
    getUrl: (s: SiteInfo) => s.youtubeUrl,
  },
  {
    key: "instagram",
    label: "Instagram",
    icon: SiInstagram,
    colorClass:
      "hover:border-pink-500/50 hover:bg-pink-500/10 hover:text-pink-400",
    getUrl: (s: SiteInfo) => s.instagramUrl,
  },
  {
    key: "twitter",
    label: "Twitter / X",
    icon: SiX,
    colorClass:
      "hover:border-foreground/30 hover:bg-foreground/5 hover:text-foreground",
    getUrl: (s: SiteInfo) => s.twitterUrl,
  },
];

export default function ContactSection({
  siteInfo,
  onAdminClick,
}: ContactSectionProps) {
  const currentYear = new Date().getFullYear();

  return (
    <section
      id="contact"
      className="py-20 px-4 sm:px-6 lg:px-8 relative"
      data-ocid="contact.section"
    >
      <div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, oklch(0.62 0.23 25 / 40%), transparent)",
        }}
      />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="text-primary font-display font-semibold text-xs tracking-[0.3em] uppercase mb-3 block">
            Reach Us
          </span>
          <h2 className="font-display font-black text-4xl sm:text-5xl md:text-6xl text-foreground neon-glow mb-4">
            CONTACT
          </h2>
          <div className="section-divider mx-auto" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left: Contact Info */}
          <div>
            <h3 className="font-display font-bold text-xl text-foreground mb-6">
              Get In Touch
            </h3>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Have questions about our tournaments? Want to partner with us?
              Reach out through any of our channels and we'll get back to you
              shortly.
            </p>

            <div className="space-y-4">
              {siteInfo.contactEmail && (
                <a
                  href={`mailto:${siteInfo.contactEmail}`}
                  className="flex items-center gap-4 p-4 bg-card border border-border hover:border-primary/50 transition-all rounded-none group"
                >
                  <div className="w-10 h-10 bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                    <Mail size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                      Email
                    </p>
                    <p className="text-foreground font-medium">
                      {siteInfo.contactEmail}
                    </p>
                  </div>
                </a>
              )}

              {siteInfo.phone && (
                <a
                  href={`tel:${siteInfo.phone}`}
                  className="flex items-center gap-4 p-4 bg-card border border-border hover:border-primary/50 transition-all rounded-none group"
                >
                  <div className="w-10 h-10 bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/30 transition-colors">
                    <Phone size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-0.5">
                      Phone
                    </p>
                    <p className="text-foreground font-medium">
                      {siteInfo.phone}
                    </p>
                  </div>
                </a>
              )}
            </div>
          </div>

          {/* Right: Social Media */}
          <div>
            <h3 className="font-display font-bold text-xl text-foreground mb-6">
              Follow Us
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SOCIAL_CONFIG.map(
                ({ key, label, icon: Icon, colorClass, getUrl }) => {
                  const url = getUrl(siteInfo);
                  if (!url) return null;
                  return (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 p-4 bg-card border border-border transition-all duration-300 rounded-none group ${colorClass}`}
                    >
                      <div className="w-10 h-10 flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-110">
                        <Icon
                          size={20}
                          className="text-muted-foreground group-hover:text-inherit transition-colors"
                        />
                      </div>
                      <span className="font-display font-semibold text-sm text-muted-foreground group-hover:text-inherit transition-colors">
                        {label}
                      </span>
                    </a>
                  );
                },
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <img
              src="/assets/generated/logo-transparent.dim_400x400.png"
              alt="Indie Bloodline Esports"
              className="w-6 h-6 rounded object-cover"
            />
            <span>
              © {currentYear} Indie Bloodline Esports. All rights reserved.
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={onAdminClick}
              className="hover:text-primary transition-colors text-xs"
            >
              Admin
            </button>
          </div>
        </div>
      </footer>
    </section>
  );
}
