import { useCallback, useEffect, useState } from "react";
import liff from "@line/liff";
import { PlayerType } from "@/types/playerTypes";
import { getPlayer } from "@/requests/client/player";
import { setCookies } from "@/utils/setCookies";
import { QuizType } from "@/types/quizTypes";

export function useAuthPlayer(quiz: QuizType) {
  const [error, setError] = useState(false); // TODO: エラーの種別を追加
  const [player, setPlayer] = useState<PlayerType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // LIFFの初期化
  const liffInit = useCallback(async () => {
    await liff.init(
      { liffId: process.env.NEXT_PUBLIC_LIFF_ID || "" },
      () => {},
      () => {
        setError(true); // エラー時にエラーメッセージをセット
      }
    );
  }, []);

  // IDトークンをCookieにセット
  const setTokenCookie = useCallback(async () => {
    if (error) return;

    const liffToken = liff.getIDToken();
    if (liffToken) {
      await setCookies({ liffToken });
    }
  }, [error]);

  // プレイヤーの検索
  const searchPlayer = useCallback(async () => {
    if (error) return;

    const { player, success } = await getPlayer(quiz.id);
    setPlayer(player);
    setError(!success);
  }, [error, quiz]);

  const initialization = useCallback(async () => {
    setLoading(true);
    await liffInit();
    await setTokenCookie();
    await searchPlayer();
    setLoading(false);
  }, [liffInit, setTokenCookie, searchPlayer]);

  // 初回処理
  useEffect(() => {
    initialization();
  }, [initialization]);

  return { player, loading, error };
}
