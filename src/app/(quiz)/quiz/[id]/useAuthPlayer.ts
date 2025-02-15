import { useEffect, useState } from "react";
import liff from "@line/liff";
import { PlayerType } from "@/types/playerTypes";
import { getPlayer } from "@/requests/client/player";
import { setCookies } from "@/utils/setCookies";
import { QuizType } from "@/types/quizTypes";
import { LiffMockPlugin } from "@line/liff-mock";

export function useAuthPlayer(quiz: QuizType) {
  const [error, setError] = useState(false); // TODO: エラーの種別を追加
  const [player, setPlayer] = useState<PlayerType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

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
        if (!liff.isInClient()) liff.login();
      },
      () => {
        setError(true); // エラー時にエラーメッセージをセット
      }
    );
  };

  // IDトークンをCookieにセット
  const setTokenCookie = async () => {
    if (error) return;

    const liffToken = liff.getIDToken();
    if (liffToken) {
      await setCookies({ liffToken });
    }
  };

  // プレイヤーの検索
  const searchPlayer = async () => {
    if (error) return;

    const { player, success } = await getPlayer(quiz.id);
    setPlayer(player);
    setError(!success);
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

  return { player, loading, error };
}
