import type { Tournament as BackendTournament } from "@/backend";
import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import GallerySection from "@/components/GallerySection";
import HeroSection from "@/components/HeroSection";
import HowToJoinSection from "@/components/HowToJoinSection";
import Navbar from "@/components/Navbar";
import TournamentsSection from "@/components/TournamentsSection";
import { useActor } from "@/hooks/useActor";
import type { Tournament } from "@/hooks/useLocalStore";
import { useGallery, useSiteInfo } from "@/hooks/useLocalStore";
import { useEffect, useState } from "react";

interface LandingPageProps {
  onAdminClick: () => void;
  onPlayerLoginClick?: () => void;
  onLeaderboardClick?: () => void;
  onRegisterClick?: () => void;
}

export default function LandingPage({
  onAdminClick,
  onPlayerLoginClick,
  onLeaderboardClick,
  onRegisterClick,
}: LandingPageProps) {
  const { actor } = useActor();
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const { gallery } = useGallery();
  const { siteInfo } = useSiteInfo();

  useEffect(() => {
    if (!actor) return;
    actor
      .getTournaments()
      .then((data: BackendTournament[]) => {
        setTournaments(
          data.map((t) => ({
            id: t.id.toString(),
            title: t.title,
            game: t.game,
            date: t.date,
            prizePool: t.prizePool,
            status: t.status as Tournament["status"],
            registrationUrl: t.registrationUrl,
            bannerImage: t.bannerImageId[0],
            sortOrder: Number(t.sortOrder),
          })),
        );
      })
      .catch(() => {});
  }, [actor]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar
        onAdminClick={onAdminClick}
        onPlayerLoginClick={onPlayerLoginClick}
        onLeaderboardClick={onLeaderboardClick}
        onRegisterClick={onRegisterClick}
      />
      <main>
        <HeroSection />
        <TournamentsSection tournaments={tournaments} />
        <HowToJoinSection />
        <AboutSection siteInfo={siteInfo} />
        <GallerySection gallery={gallery} />
        <ContactSection siteInfo={siteInfo} onAdminClick={onAdminClick} />
      </main>
    </div>
  );
}
