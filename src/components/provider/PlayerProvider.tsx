"use client";

import { getPlayer } from "@/requests/client/player";
import { PlayerType } from "@/types/playerTypes";
import {
  createContext,
  useState,
  useEffect,
  FC,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import { useLiffContext } from "./LiffProvider";

type PlayerContextType = {
  player: PlayerType | null;
  refetch?: () => Promise<void>;
  loading: boolean;
  profile: {
    displayName: string;
    userId: string;
  } | null;
};

const PlayerContext = createContext<PlayerContextType>({
  player: null,
  loading: false,
  profile: null,
});

export const usePlayerContext = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  return context;
};

export const PlayerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { profile, liffState } = useLiffContext();
  const [player, setPlayer] = useState<PlayerType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const searchPlayer = useCallback(async () => {
    if (liffState) {
      setLoading(true);
      const player = await getPlayer(liffState?.getIDToken() || "");
      setPlayer(player);
      setLoading(false);
    }
  }, [liffState]);

  const refetch = useCallback(async () => {
    searchPlayer();
  }, [searchPlayer]);

  useEffect(() => {
    searchPlayer();
  }, [searchPlayer]);

  return (
    <PlayerContext.Provider value={{ player, profile, loading, refetch }}>
      {children}
    </PlayerContext.Provider>
  );
};
