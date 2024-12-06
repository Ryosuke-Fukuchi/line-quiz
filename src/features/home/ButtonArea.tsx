"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { createPlayer, getPlayer, PlayerType } from "@/requests/player";
import { QuizType } from "@/requests/quiz";
import { PLAYER_STATUS } from "@/const.ts/player";
import { getQuestionByNumber } from "@/requests/question";
import { useLiff } from "@/app/liffProvider";

type PropsType = {
  quiz: QuizType;
};

export const ButtonArea: React.FC<PropsType> = ({ quiz }) => {
  const { liffState, liffError } = useLiff();
  const router = useRouter();
  const [player, setPlayer] = React.useState<PlayerType | null>(null);
  const [isValid, setIsValid] = React.useState<boolean | null>(null);
  const [loading, setLoading] = React.useState(false);

  const [profile, setProfile] = React.useState<{
    displayName: string;
    userId: string;
  } | null>(null);

  const getProfile = React.useCallback(async () => {
    setLoading(true);
    if (liffState) {
      try {
        const profile = await liffState.getProfile();
        setProfile(profile);
        setIsValid(true);
        const player = await getPlayer(profile.userId);
        setPlayer(player);
      } catch (e) {
        console.error(e);
        setIsValid(false);
      }
    }
    setLoading(false);
  }, [liffState]);

  React.useEffect(() => {
    getProfile();
  }, [getProfile]);

  const buttonType = React.useMemo(() => {
    if (isValid == null) return { text: "loading", type: "loading" };
    if (!isValid) return { text: "問題が発生しました!", type: "error" };
    if (!player) return { text: "クイズに参加する!", type: "join" };
    return player.status === PLAYER_STATUS.playing
      ? { text: `第${player?.question_number}問に進む!`, type: "restart" }
      : { text: "結果を見る!", type: "confirm" };
  }, [isValid, player]);

  const handleJoin = async () => {
    setLoading(true);
    switch (buttonType.type) {
      case "join":
        await createPlayer({
          name: profile?.displayName as string,
          user_id: profile?.userId as string,
          quiz_id: quiz.id,
        });
        router.push("/question");
        break;
      case "restart":
        const question = await getQuestionByNumber(
          player?.question_number as number
        );
        router.push(`/question/${question?.id}`);
        break;
      case "confirm":
        router.push("/player_result");
        break;
      default:
        break;
    }
    setLoading(false);
  };

  if (liffError) {
    return "エラーが発生しました";
  }

  return (
    <button
      className="border-2 border-emerald-700 text-white rounded-md bg-emerald-700 hover:border-emerald-700 hover:bg-white 
hover:text-emerald-700 font-semibold text-xl tracking-wide shadow-md shadow-emerald-900/40 active:shadow-none py-2 px-6"
      onClick={handleJoin}
      disabled={loading || !isValid}
    >
      {loading ? "loading..." : buttonType.text}
    </button>
  );
};
