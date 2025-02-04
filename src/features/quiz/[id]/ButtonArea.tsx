"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { createPlayer, patchPlayer } from "@/requests/client/player";
import { PLAYER_STATUS } from "@/const.ts/player";
import { SpinLoading } from "@/components/loading/SpinLoading";
import { QuizType } from "@/types/quizTypes";
import { PlayerType } from "@/types/playerTypes";

type PropsType = {
  quiz: QuizType;
  player: PlayerType | null;
};

// クイズ開始ボタン
export const ButtonArea: React.FC<PropsType> = ({ quiz, player }) => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);

  const buttonType: { text: string; type: "start" | "restart" | "confirm" } =
    React.useMemo(() => {
      if (!player) return { text: "クイズに参加する!", type: "start" };
      return player.status === PLAYER_STATUS.playing
        ? { text: `第${player?.question_number}問に進む!`, type: "restart" }
        : { text: "結果を見る!", type: "confirm" };
    }, [player]);

  const handleStart = async () => {
    setLoading(true);
    switch (buttonType.type) {
      case "start":
        await createPlayer({
          quiz_id: quiz.id,
          next_question_id: quiz.question_set.find(
            (q) => q.question_number === 1
          )?.public_id as string,
        });
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
            router.push(`/player_result/${player?.user_id}`);
          }
        }
        break;
    }
    setLoading(false);
  };

  return (
    <>
      <button
        className="flex justify-center items-center border-2 border-emerald-700 text-white rounded-md bg-emerald-700 hover:border-emerald-700 hover:bg-white 
      hover:text-emerald-700 font-semibold text-xl tracking-wide shadow-md shadow-emerald-900/40 active:shadow-none py-2 px-6"
        onClick={handleStart}
        disabled={loading}
      >
        {loading ? <SpinLoading text="Loading" /> : buttonType.text}
      </button>
    </>
  );
};
