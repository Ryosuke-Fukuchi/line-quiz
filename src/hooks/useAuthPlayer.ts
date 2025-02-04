import { useCallback, useEffect, useState } from "react";
import liff, { type Liff } from "@line/liff";
import { PlayerType } from "@/types/playerTypes";
import { getPlayer } from "@/requests/client/player";

export function useAuthPlayer() {
  const [liffState, setliffState] = useState<Liff | null>(null);
  const [error, setError] = useState(false); // TODO: エラーの種別を追加
  const [player, setPlayer] = useState<PlayerType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const liffInit = useCallback(async () => {
    await liff.init(
      { liffId: process.env.NEXT_PUBLIC_LIFF_ID || "" },
      () => {
        setliffState(liff);
      }, // 成功時に liff をセット
      (error) => {
        console.error("LIFF initialization failed", error);
        setError(true); // エラー時にエラーメッセージをセット
        setLoading(false);
      }
    );
  }, []);

  useEffect(() => {
    liffInit();
  }, [liffInit]);

  const searchPlayer = useCallback(async () => {
    const { player, success } = await getPlayer(liffState?.getIDToken() || "");
    setPlayer(player);
    setError(!success);
    setLoading(false);
  }, [liffState]);

  useEffect(() => {
    if (liffState) {
      searchPlayer();
    }
  }, [liffState, searchPlayer]);

  return { player, loading, error };
}
