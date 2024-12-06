"use client";

import { getPlayer, PlayerType } from "@/requests/player";
import {
  createContext,
  useState,
  useEffect,
  FC,
  ReactNode,
  useContext,
  useCallback,
} from "react";
import { useLiffContext } from "./liffProvider";

type PlayerContextType = {
  player: PlayerType | null;
  refetch?: () => Promise<void>;
  loading: boolean;
};

const PlayerContext = createContext<PlayerContextType>({
  player: null,
  loading: false,
});

export const usePlayerContext = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  return context;
};

export const PlayerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { profile } = useLiffContext();
  const [player, setPlayer] = useState<PlayerType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const searchPlayer = useCallback(async () => {
    setLoading(true);
    if (profile) {
      const player = await getPlayer(profile?.userId || "");
      setPlayer(player);
    }
    setLoading(false);
  }, [profile]);

  const refetch = useCallback(async () => {
    searchPlayer();
  }, [searchPlayer]);

  useEffect(() => {
    searchPlayer();
  }, [searchPlayer]);

  return (
    <PlayerContext.Provider value={{ player, loading, refetch }}>
      {children}
    </PlayerContext.Provider>
  );
};
