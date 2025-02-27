"use client";

import React from "react";
import { PLAYER_STATUS } from "@/const.ts/player";
import { PlayerType } from "@/types/playerTypes";
import Link from "next/link";
import { cn } from "@/utils/cn";

const buttonStyle =
  "border-2 border-emerald-700 text-white rounded-md bg-emerald-700 hover:border-emerald-700 hover:bg-white hover:text-emerald-700 font-semibold text-xl tracking-wide shadow-md shadow-emerald-900/40 active:shadow-none py-2 px-6";

type PropsType = {
  player: PlayerType | null;
  join: () => Promise<void>;
  updating: boolean;
};

// クイズ開始ボタン
export const ButtonArea: React.FC<PropsType> = ({ player, join, updating }) => {
  // クイズ未参加の場合
  if (!player) {
    return (
      <button
        className={cn(buttonStyle, "flex justify-center items-center")}
        onClick={join}
        disabled={updating}
      >
        クイズに参加する!
      </button>
    );
  }

  // クイズ終了終了済みの場合
  if (player.status === PLAYER_STATUS.done) {
    return (
      <Link href={`/player_result/${player.public_id}`} className={buttonStyle}>
        結果を見る!
      </Link>
    );
  }

  // 途中離脱した場合
  return (
    <Link href={`/question/${player.next_question_id}`} className={buttonStyle}>
      {`第${player.question_number}問に進む!`}
    </Link>
  );
};
