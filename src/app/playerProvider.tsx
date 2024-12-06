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
import { useLiff } from "./liffProvider";

type PlayerContextType = {
  player: PlayerType | null;
};

const PlayerContext = createContext<PlayerContextType>({
  player: null,
});

export const usePlayer = (): PlayerContextType => {
  const context = useContext(PlayerContext);
  return context;
};

export const PlayerProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { profile } = useLiff();
  const [player, setPlayer] = useState<PlayerType | null>(null);

  const searchPlayer = useCallback(async () => {
    if (profile) {
      const player = await getPlayer(profile?.userId || "");
      setPlayer(player);
    }
  }, [profile]);

  useEffect(() => {
    searchPlayer();
  }, [searchPlayer]);

  return (
    <PlayerContext.Provider value={{ player }}>
      {children}
    </PlayerContext.Provider>
  );
};
