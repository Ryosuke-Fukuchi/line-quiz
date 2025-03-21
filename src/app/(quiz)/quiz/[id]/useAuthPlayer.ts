import { useEffect, useState } from "react";
import liff from "@line/liff";
import { PlayerType } from "@/types/playerTypes";
import { setCookies } from "@/utils/setCookies";
import { QuizType } from "@/types/quizTypes";
import { LiffMockPlugin } from "@line/liff-mock";
import { useGlobalError } from "@/hooks/useGlobalError";
import { getPlayer } from "./getPlayer";

export function useAuthPlayer(quiz: QuizType) {
  const [player, setPlayer] = useState<PlayerType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const { error, setError } = useGlobalError();

  // LIFFの初期化
  const liffInit = async () => {
    if (process.env.NEXT_PUBLIC_LIFF_MOCK_MODE === "true") {
      // モックモードの設定
      liff.use(new LiffMockPlugin());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (liff as any).$mock.set((p: any) => ({
        ...p,
        getProfile: { displayName: "テスト太郎", userId: "xxxxxxxxx" },
        getIDToken: "token-xyz",
      }));
    }

    await liff.init(
      {
        liffId: process.env.NEXT_PUBLIC_LIFF_ID || "",
        mock: process.env.NEXT_PUBLIC_LIFF_MOCK_MODE === "true",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any,
      () => {
        if (!liff.isInClient() && !liff.isLoggedIn) liff.login();
      },
      (e) => {
        setError(e); // エラー時にエラーメッセージをセット
      }
    );
  };

  // IDトークンをCookieにセット
  const setTokenCookie = async () => {
    if (error) return;

    try {
      const liffToken = liff.getIDToken();
      if (liffToken) {
        await setCookies({ liffToken });
      }
    } catch {
      setError(new Error("Error at setTokenCookie"));
    }
  };

  // プレイヤーの検索
  const searchPlayer = async () => {
    if (error) return;

    try {
      const player = await getPlayer(quiz.id);
      setPlayer(player);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e);
    }
  };

  const initialization = async () => {
    setLoading(true);
    await liffInit();
    await setTokenCookie();
    await searchPlayer();
    setLoading(false);
  };

  // 初回処理
  useEffect(() => {
    initialization();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { player, loading };
}
