import type { ReactNode } from "react";
import {
  PlayerSessionContext,
  usePlayerSessionState,
} from "./usePlayerSessionCore";

export function PlayerSessionProvider({ children }: { children: ReactNode }) {
  const state = usePlayerSessionState();
  return (
    <PlayerSessionContext.Provider value={state}>
      {children}
    </PlayerSessionContext.Provider>
  );
}
