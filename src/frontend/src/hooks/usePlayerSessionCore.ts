import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { PlayerPublic } from "../backend";
import { useActor } from "./useActor";

export const TOKEN_KEY = "player_token";
const ADMIN_TOKEN = "admin_local_token";
const ADMIN_USERNAME = "jaiswin";
const ADMIN_PASSWORD = "jaiswin.B1";

const ADMIN_PLAYER: PlayerPublic = {
  id: BigInt(0),
  username: ADMIN_USERNAME,
  uid: "admin",
  gameAccountType: "admin",
  gameplayLevel: "admin",
  gameplayDescription: "Admin account",
  guildName: "Indie Bloodline",
  playStyles: [],
  status: { approved: null },
  rank: BigInt(0),
  wins: BigInt(0),
  topPlacements: BigInt(0),
  tournamentsJoined: [],
  createdAt: BigInt(0),
};

export type LoginResult = "success" | "invalid" | "error";

export interface PlayerSessionContextValue {
  player: PlayerPublic | null;
  isLoggedIn: boolean;
  isInitializing: boolean;
  login: (username: string, password: string) => Promise<LoginResult>;
  logout: () => void;
  refreshPlayer: () => Promise<void>;
}

export const PlayerSessionContext = createContext<PlayerSessionContextValue>({
  player: null,
  isLoggedIn: false,
  isInitializing: true,
  login: async () => "error",
  logout: () => {},
  refreshPlayer: async () => {},
});

export function usePlayerSession() {
  return useContext(PlayerSessionContext);
}

export function usePlayerSessionState(): PlayerSessionContextValue {
  const { actor } = useActor();
  const [player, setPlayer] = useState<PlayerPublic | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const refreshPlayer = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setPlayer(null);
      return;
    }
    // Admin local session
    if (token === ADMIN_TOKEN) {
      setPlayer(ADMIN_PLAYER);
      return;
    }
    if (!actor) {
      setPlayer(null);
      return;
    }
    try {
      const result = await actor.getPlayerByToken(token);
      if (result.length > 0) {
        setPlayer(result[0] ?? null);
      } else {
        setPlayer(null);
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch {
      setPlayer(null);
    }
  }, [actor]);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    // Admin local session – no backend needed
    if (token === ADMIN_TOKEN) {
      setPlayer(ADMIN_PLAYER);
      setIsInitializing(false);
      return;
    }
    if (!actor) return;
    if (!token) {
      setIsInitializing(false);
      return;
    }
    refreshPlayer().finally(() => setIsInitializing(false));
  }, [actor, refreshPlayer]);

  const login = useCallback(
    async (username: string, password: string): Promise<LoginResult> => {
      // Admin shortcut – handled entirely in the frontend
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        localStorage.setItem(TOKEN_KEY, ADMIN_TOKEN);
        setPlayer(ADMIN_PLAYER);
        return "success";
      }

      if (!actor) return "error";
      try {
        const result = await actor.loginPlayer(username, password);
        if (result.length > 0) {
          const token = result[0];
          if (!token) return "invalid";
          localStorage.setItem(TOKEN_KEY, token);
          const playerResult = await actor.getPlayerByToken(token);
          if (playerResult.length > 0 && playerResult[0]) {
            setPlayer(playerResult[0]);
          }
          return "success";
        }
        return "invalid";
      } catch {
        return "error";
      }
    },
    [actor],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setPlayer(null);
  }, []);

  return {
    player,
    isLoggedIn: player !== null,
    isInitializing,
    login,
    logout,
    refreshPlayer,
  };
}
