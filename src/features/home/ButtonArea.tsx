"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { createPlayer, patchPlayer } from "@/requests/player";
import { QuizType } from "@/requests/quiz";
import { PLAYER_STATUS } from "@/const.ts/player";
import { useLiff } from "@/app/liffProvider";
import { usePlayer } from "@/app/playerProvider";

type PropsType = {
  quiz: QuizType;
};

export const ButtonArea: React.FC<PropsType> = ({ quiz }) => {
  const { profile } = useLiff();
  const { player, refetch: refetchPlayer } = usePlayer();
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const buttonType = React.useMemo(() => {
    if (!player) return { text: "クイズに参加する!", type: "join" };
    return player.status === PLAYER_STATUS.playing
      ? { text: `第${player?.question_number}問に進む!`, type: "restart" }
      : { text: "結果を見る!", type: "confirm" };
  }, [player]);

  const handleJoin = async () => {
    setLoading(true);
    switch (buttonType.type) {
      case "join":
        await createPlayer({
          name: profile?.displayName as string,
          user_id: profile?.userId as string,
          quiz_id: quiz.id,
        });
        await refetchPlayer?.();
        router.push("/question");
        break;
      case "restart":
        router.push(`/question/${player?.next_question_id}`);
        break;
      case "confirm":
        {
          if (player) {
            await patchPlayer(player?.id, {
              status: PLAYER_STATUS.result_confirmed,
            });
            await refetchPlayer?.();
            router.push(`/player_result/${player?.user_id}`);
          }
        }
        break;
      default:
        break;
    }
    setLoading(false);
  };

  return (
    <button
      className="border-2 border-emerald-700 text-white rounded-md bg-emerald-700 hover:border-emerald-700 hover:bg-white 
hover:text-emerald-700 font-semibold text-xl tracking-wide shadow-md shadow-emerald-900/40 active:shadow-none py-2 px-6"
      onClick={handleJoin}
      disabled={loading || !profile}
    >
      {loading ? "loading..." : buttonType.text}
    </button>
  );
};
