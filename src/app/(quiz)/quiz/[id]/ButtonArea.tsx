"use client";

import React from "react";
import { PLAYER_STATUS } from "@/const.ts/player";
import { SpinLoading } from "@/components/loading/SpinLoading";
import { QuizType } from "@/types/quizTypes";
import { PlayerType } from "@/types/playerTypes";
import Link from "next/link";
import { createPlayer } from "./createPlayer";
import { cn } from "@/utils/cn";

const linkStyle =
  "border-2 border-emerald-700 text-white rounded-md bg-emerald-700 hover:border-emerald-700 hover:bg-white hover:text-emerald-700 font-semibold text-xl tracking-wide shadow-md shadow-emerald-900/40 active:shadow-none py-2 px-6";

type PropsType = {
  quiz: QuizType;
  player: PlayerType | null;
};

// クイズ開始ボタン
export const ButtonArea: React.FC<PropsType> = ({ quiz, player }) => {
  const [loading, setLoading] = React.useState(false);

  const join = async () => {
    setLoading(true);
    await createPlayer({
      quiz_id: quiz.id,
      next_question_id: quiz.question_set.find((q) => q.question_number === 1)
        ?.public_id as string,
    });
    setLoading(false);
  };

  // クイズ未参加の場合
  if (!player) {
    return (
      <button
        className={cn(linkStyle, "flex justify-center items-center")}
        onClick={join}
        disabled={loading}
      >
        {loading ? <SpinLoading text="Loading" /> : "クイズに参加する!"}
      </button>
    );
  }

  // クイズ終了終了済みの場合
  if (player.status === PLAYER_STATUS.done) {
    return (
      <Link href={`/player_result/${player.public_id}`} className={linkStyle}>
        結果を見る!
      </Link>
    );
  }

  // 途中離脱した場合
  return (
    <Link href={`/question/${player.next_question_id}`} className={linkStyle}>
      {`第${player?.question_number}問に進む!`}
    </Link>
  );
};
