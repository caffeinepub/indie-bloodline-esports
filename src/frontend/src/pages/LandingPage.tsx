import AboutSection from "@/components/AboutSection";
import ContactSection from "@/components/ContactSection";
import GallerySection from "@/components/GallerySection";
import HeroSection from "@/components/HeroSection";
import HowToJoinSection from "@/components/HowToJoinSection";
import Navbar from "@/components/Navbar";
import TournamentsSection from "@/components/TournamentsSection";
import { useGallery, useSiteInfo, useTournaments } from "@/hooks/useLocalStore";

interface LandingPageProps {
  onAdminClick: () => void;
}

export default function LandingPage({ onAdminClick }: LandingPageProps) {
  const { tournaments } = useTournaments();
  const { gallery } = useGallery();
  const { siteInfo } = useSiteInfo();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onAdminClick={onAdminClick} />
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
