import type { ReactNode } from "react";
import {
  PlayerSessionContext,
  TOKEN_KEY,
  usePlayerSession,
  usePlayerSessionState,
} from "./usePlayerSessionCore";

export type {
  PlayerSessionContextValue,
  LoginResult,
} from "./usePlayerSessionCore";
export { usePlayerSession, PlayerSessionContext, TOKEN_KEY };

export function PlayerSessionProvider({ children }: { children: ReactNode }) {
  const state = usePlayerSessionState();
  return (
    <PlayerSessionContext.Provider value={state}>
      {children}
    </PlayerSessionContext.Provider>
  );
}
