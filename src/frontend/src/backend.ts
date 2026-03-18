// Auto-generated backend interface stub
// This file is replaced during production build by the actual Motoko canister bindings

import type { Identity } from "@icp-sdk/core/agent";

export type CreateActorOptions = {
  agentOptions?: {
    identity?: Identity | Promise<Identity>;
    host?: string;
    [key: string]: unknown;
  };
  actorOptions?: {
    canisterId?: string;
    [key: string]: unknown;
  };
};

export class ExternalBlob {
  constructor(public url: string, public headers?: [string, string][]) {}

  static fromURL(url: string): ExternalBlob {
    return new ExternalBlob(url);
  }

  async getBytes(): Promise<Uint8Array> {
    const response = await fetch(this.url);
    const buffer = await response.arrayBuffer();
    return new Uint8Array(buffer);
  }

  onProgress?: (progress: number) => void;
}

export type Tournament = {
  id: bigint;
  title: string;
  game: string;
  date: string;
  prizePool: string;
  status: string;
  registrationUrl: string;
  bannerImageId: [] | [string];
  sortOrder: bigint;
};

export type GalleryItem = {
  id: bigint;
  caption: string;
  imageId: [] | [string];
  sortOrder: bigint;
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

export type PlayerStatus =
  | { pending: null }
  | { approved: null }
  | { rejected: null };

export type PlayerPublic = {
  id: bigint;
  username: string;
  uid: string;
  gameAccountType: string;
  gameplayLevel: string;
  gameplayDescription: string;
  guildName: string;
  playStyles: string[];
  status: PlayerStatus;
  rank: bigint;
  wins: bigint;
  topPlacements: bigint;
  tournamentsJoined: bigint[];
  createdAt: bigint;
};

export type Player = PlayerPublic & {
  gameAccountEmail: string;
  gameAccountPassword: string;
  screenshotBlobId: [] | [string];
  screenRecordBlobId: [] | [string];
};

export type backendInterface = {
  _initializeAccessControlWithSecret(secret: string): Promise<void>;
  // Tournaments
  getTournaments(): Promise<Tournament[]>;
  addTournament(title: string, game: string, date: string, prizePool: string, status: string, registrationUrl: string, bannerImageId: [] | [string], sortOrder: bigint): Promise<bigint>;
  updateTournament(id: bigint, title: string, game: string, date: string, prizePool: string, status: string, registrationUrl: string, bannerImageId: [] | [string], sortOrder: bigint): Promise<void>;
  deleteTournament(id: bigint): Promise<void>;
  // Tournaments (token-auth)
  addTournamentAuth(adminKey: string, title: string, game: string, date: string, prizePool: string, status: string, registrationUrl: string, bannerImageId: [] | [string], sortOrder: bigint): Promise<bigint>;
  updateTournamentAuth(adminKey: string, id: bigint, title: string, game: string, date: string, prizePool: string, status: string, registrationUrl: string, bannerImageId: [] | [string], sortOrder: bigint): Promise<void>;
  deleteTournamentAuth(adminKey: string, id: bigint): Promise<void>;
  // Gallery
  getGalleryItems(): Promise<GalleryItem[]>;
  addGalleryItem(caption: string, imageId: [] | [string], sortOrder: bigint): Promise<bigint>;
  updateGalleryItem(id: bigint, caption: string, imageId: [] | [string], sortOrder: bigint): Promise<void>;
  deleteGalleryItem(id: bigint): Promise<void>;
  // Gallery (token-auth)
  addGalleryItemAuth(adminKey: string, caption: string, imageId: [] | [string], sortOrder: bigint): Promise<bigint>;
  updateGalleryItemAuth(adminKey: string, id: bigint, caption: string, imageId: [] | [string], sortOrder: bigint): Promise<void>;
  deleteGalleryItemAuth(adminKey: string, id: bigint): Promise<void>;
  // Site Info
  getSiteInfo(): Promise<SiteInfo>;
  updateSiteInfo(info: SiteInfo): Promise<void>;
  updateSiteInfoAuth(adminKey: string, info: SiteInfo): Promise<void>;
  // Player Registration & Auth
  submitRegistration(username: string, uid: string, gameAccountType: string, gameAccountEmail: string, gameAccountPassword: string, screenshotBlobId: [] | [string], screenRecordBlobId: [] | [string], gameplayLevel: string, gameplayDescription: string, guildName: string, playStyles: string[]): Promise<bigint>;
  loginPlayer(username: string, password: string): Promise<[] | [string]>;
  getPlayerByToken(token: string): Promise<[] | [PlayerPublic]>;
  joinTournament(token: string, tournamentId: bigint): Promise<boolean>;
  getLeaderboard(): Promise<PlayerPublic[]>;
  getPlayerProfile(playerId: bigint): Promise<[] | [PlayerPublic]>;
  // Admin Player Management (legacy caller-based)
  getPendingRegistrations(): Promise<Player[]>;
  getAllPlayers(): Promise<Player[]>;
  approvePlayer(playerId: bigint): Promise<void>;
  rejectPlayer(playerId: bigint): Promise<void>;
  setPlayerRanking(playerId: bigint, rank: bigint): Promise<void>;
  updatePlayerStats(playerId: bigint, wins: bigint, topPlacements: bigint): Promise<void>;
  getTournamentJoinRequests(tournamentId: bigint): Promise<PlayerPublic[]>;
  // Admin Player Management (token-auth)
  getPendingRegistrationsAuth(adminKey: string): Promise<Player[]>;
  getAllPlayersAuth(adminKey: string): Promise<Player[]>;
  approvePlayerAuth(adminKey: string, playerId: bigint): Promise<void>;
  rejectPlayerAuth(adminKey: string, playerId: bigint): Promise<void>;
  setPlayerRankingAuth(adminKey: string, playerId: bigint, rank: bigint): Promise<void>;
  updatePlayerStatsAuth(adminKey: string, playerId: bigint, wins: bigint, topPlacements: bigint): Promise<void>;
  getTournamentJoinRequestsAuth(adminKey: string, tournamentId: bigint): Promise<PlayerPublic[]>;
};

export function createActor(
  canisterId: string,
  uploadFn: (blob: ExternalBlob) => Promise<Uint8Array>,
  downloadFn: (bytes: Uint8Array) => Promise<ExternalBlob>,
  options?: CreateActorOptions,
): backendInterface {
  console.warn("Backend stub: createActor called", { canisterId, options });
  return {
    _initializeAccessControlWithSecret: async (_secret: string) => {},
    getTournaments: async () => [],
    addTournament: async () => BigInt(0),
    updateTournament: async () => {},
    deleteTournament: async () => {},
    addTournamentAuth: async () => BigInt(0),
    updateTournamentAuth: async () => {},
    deleteTournamentAuth: async () => {},
    getGalleryItems: async () => [],
    addGalleryItem: async () => BigInt(0),
    updateGalleryItem: async () => {},
    deleteGalleryItem: async () => {},
    addGalleryItemAuth: async () => BigInt(0),
    updateGalleryItemAuth: async () => {},
    deleteGalleryItemAuth: async () => {},
    getSiteInfo: async () => ({
      aboutText: "", missionText: "", contactEmail: "",
      facebookUrl: "", discordUrl: "", youtubeUrl: "",
      instagramUrl: "", twitterUrl: "", phone: "",
    }),
    updateSiteInfo: async () => {},
    updateSiteInfoAuth: async () => {},
    submitRegistration: async () => BigInt(0),
    loginPlayer: async () => [],
    getPlayerByToken: async () => [],
    joinTournament: async () => false,
    getLeaderboard: async () => [],
    getPlayerProfile: async () => [],
    getPendingRegistrations: async () => [],
    getAllPlayers: async () => [],
    approvePlayer: async () => {},
    rejectPlayer: async () => {},
    setPlayerRanking: async () => {},
    updatePlayerStats: async () => {},
    getTournamentJoinRequests: async () => [],
    getPendingRegistrationsAuth: async () => [],
    getAllPlayersAuth: async () => [],
    approvePlayerAuth: async () => {},
    rejectPlayerAuth: async () => {},
    setPlayerRankingAuth: async () => {},
    updatePlayerStatsAuth: async () => {},
    getTournamentJoinRequestsAuth: async () => [],
  };
}
