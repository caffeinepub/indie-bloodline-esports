import { useCallback, useEffect, useState } from "react";

export type Tournament = {
  id: string;
  title: string;
  game: string;
  date: string;
  prizePool: string;
  status: "upcoming" | "ongoing" | "completed";
  registrationUrl: string;
  bannerImage?: string;
  sortOrder: number;
};

export type GalleryItem = {
  id: string;
  caption: string;
  image?: string;
  sortOrder: number;
};

export type SiteInfo = {
  aboutText: string;
  missionText: string;
  contactEmail: string;
  facebookUrl: string;
  discordUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  twitterUrl: string;
  phone: string;
};

const TOURNAMENTS_KEY = "ibe_tournaments";
const GALLERY_KEY = "ibe_gallery";
const SITE_INFO_KEY = "ibe_site_info";

const DEFAULT_TOURNAMENTS: Tournament[] = [
  {
    id: "t1",
    title: "Free Fire Championship Season 5",
    game: "Free Fire",
    date: "March 20, 2026",
    prizePool: "$500",
    status: "upcoming",
    registrationUrl: "https://discord.gg/indiebloodline",
    bannerImage: "/assets/generated/tournament-freefire.dim_800x450.jpg",
    sortOrder: 1,
  },
  {
    id: "t2",
    title: "Mobile Legends Open Cup",
    game: "Mobile Legends",
    date: "April 5, 2026",
    prizePool: "$300",
    status: "upcoming",
    registrationUrl: "https://discord.gg/indiebloodline",
    bannerImage: "/assets/generated/tournament-ml.dim_800x450.jpg",
    sortOrder: 2,
  },
  {
    id: "t3",
    title: "PUBG Mobile Showdown",
    game: "PUBG Mobile",
    date: "February 10, 2026",
    prizePool: "$400",
    status: "completed",
    registrationUrl: "",
    bannerImage: "/assets/generated/tournament-pubg.dim_800x450.jpg",
    sortOrder: 3,
  },
];

const DEFAULT_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    caption: "Free Fire Season 4 Grand Finals",
    image: "/assets/generated/gallery-1.dim_600x400.jpg",
    sortOrder: 1,
  },
  {
    id: "g2",
    caption: "Award Ceremony - Season 3 Champions",
    image: "/assets/generated/gallery-2.dim_600x400.jpg",
    sortOrder: 2,
  },
  {
    id: "g3",
    caption: "Community LAN Event 2025",
    image: "/assets/generated/gallery-3.dim_600x400.jpg",
    sortOrder: 3,
  },
];

const DEFAULT_SITE_INFO: SiteInfo = {
  aboutText:
    "Indie Bloodline Esports is a premier tournament organizing company dedicated to bringing competitive gaming to the community. We specialize in mobile and PC esports, providing players with a platform to showcase their skills and compete for glory.",
  missionText:
    "Our mission is to grow the esports ecosystem by hosting fair, exciting, and professionally managed tournaments. We believe every player deserves a chance to compete at the highest level.",
  contactEmail: "contact@indiebloodline.gg",
  facebookUrl: "https://facebook.com/indiebloodlineesports",
  discordUrl: "https://discord.gg/indiebloodline",
  youtubeUrl: "https://youtube.com/@indiebloodlineesports",
  instagramUrl: "https://instagram.com/indiebloodlineesports",
  twitterUrl: "https://twitter.com/indiebloodline",
  phone: "+63 912 345 6789",
};

function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
  } catch {
    // ignore parse errors
  }
  return defaultValue;
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

function generateId(): string {
  return `${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
}

export function useTournaments() {
  const [tournaments, setTournamentsState] = useState<Tournament[]>(() =>
    loadFromStorage(TOURNAMENTS_KEY, DEFAULT_TOURNAMENTS),
  );

  const persist = useCallback((updated: Tournament[]) => {
    setTournamentsState(updated);
    saveToStorage(TOURNAMENTS_KEY, updated);
  }, []);

  const addTournament = useCallback(
    (data: Omit<Tournament, "id" | "sortOrder">) => {
      setTournamentsState((prev) => {
        const next = [
          ...prev,
          { ...data, id: generateId(), sortOrder: prev.length + 1 },
        ];
        saveToStorage(TOURNAMENTS_KEY, next);
        return next;
      });
    },
    [],
  );

  const updateTournament = useCallback(
    (id: string, data: Partial<Omit<Tournament, "id">>) => {
      setTournamentsState((prev) => {
        const next = prev.map((t) => (t.id === id ? { ...t, ...data } : t));
        saveToStorage(TOURNAMENTS_KEY, next);
        return next;
      });
    },
    [],
  );

  const deleteTournament = useCallback((id: string) => {
    setTournamentsState((prev) => {
      const next = prev.filter((t) => t.id !== id);
      saveToStorage(TOURNAMENTS_KEY, next);
      return next;
    });
  }, []);

  return {
    tournaments,
    addTournament,
    updateTournament,
    deleteTournament,
    persist,
  };
}

export function useGallery() {
  const [gallery, setGalleryState] = useState<GalleryItem[]>(() =>
    loadFromStorage(GALLERY_KEY, DEFAULT_GALLERY),
  );

  const addGalleryItem = useCallback(
    (data: Omit<GalleryItem, "id" | "sortOrder">) => {
      setGalleryState((prev) => {
        const next = [
          ...prev,
          { ...data, id: generateId(), sortOrder: prev.length + 1 },
        ];
        saveToStorage(GALLERY_KEY, next);
        return next;
      });
    },
    [],
  );

  const updateGalleryItem = useCallback(
    (id: string, data: Partial<Omit<GalleryItem, "id">>) => {
      setGalleryState((prev) => {
        const next = prev.map((g) => (g.id === id ? { ...g, ...data } : g));
        saveToStorage(GALLERY_KEY, next);
        return next;
      });
    },
    [],
  );

  const deleteGalleryItem = useCallback((id: string) => {
    setGalleryState((prev) => {
      const next = prev.filter((g) => g.id !== id);
      saveToStorage(GALLERY_KEY, next);
      return next;
    });
  }, []);

  return { gallery, addGalleryItem, updateGalleryItem, deleteGalleryItem };
}

export function useSiteInfo() {
  const [siteInfo, setSiteInfoState] = useState<SiteInfo>(() =>
    loadFromStorage(SITE_INFO_KEY, DEFAULT_SITE_INFO),
  );

  const updateSiteInfo = useCallback((data: Partial<SiteInfo>) => {
    setSiteInfoState((prev) => {
      const next = { ...prev, ...data };
      saveToStorage(SITE_INFO_KEY, next);
      return next;
    });
  }, []);

  // Ensure defaults are seeded on first load
  useEffect(() => {
    if (!localStorage.getItem(SITE_INFO_KEY)) {
      saveToStorage(SITE_INFO_KEY, DEFAULT_SITE_INFO);
    }
  }, []);

  return { siteInfo, updateSiteInfo };
}
