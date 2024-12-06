"use client";

import liff, { type Liff } from "@line/liff";
import {
  createContext,
  useState,
  useEffect,
  FC,
  useCallback,
  ReactNode,
  useContext,
} from "react";

type LiffContextType = {
  liffState: Liff | null;
  profile: {
    displayName: string;
    userId: string;
  } | null;
};

const LiffContext = createContext<LiffContextType>({
  liffState: null,
  profile: null,
});

export const useLiff = (): LiffContextType => {
  const context = useContext(LiffContext);
  return context;
};

export const LiffProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [liffState, setliffState] = useState<Liff | null>(null);
  const [liffError, setLiffError] = useState<string | null>(null);
  const [profile, setProfile] = useState<{
    displayName: string;
    userId: string;
  } | null>(null);

  useEffect(() => {
    liff.init(
      { liffId: process.env.NEXT_PUBLIC_LIFF_ID || "" },
      () => {
        setliffState(liff);
      }, // 成功時に liff をセット
      (error) => {
        console.error("LIFF initialization failed", error);
        setLiffError(error.toString()); // エラー時にエラーメッセージをセット
      }
    );
  }, []);

  const getProfile = useCallback(async () => {
    if (liffState) {
      try {
        const profile = await liffState.getProfile();
        setProfile(profile);
      } catch (e) {
        console.error(e);
      }
    }
  }, [liffState]);

  useEffect(() => {
    getProfile();
  }, [getProfile]);

  if (liffError) {
    return "エラーが発生しました";
  }

  return (
    <LiffContext.Provider value={{ liffState, profile }}>
      {children}
    </LiffContext.Provider>
  );
};
