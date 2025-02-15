"use client";

import { PlayerType } from "@/types/playerTypes";
import Link from "next/link";

export const JoinSuccessView: React.FC<{
  player: PlayerType;
}> = ({ player }) => {
  return (
    <main className="min-h-screen p-8 pb-20 flex flex-col items-center">
      <div className="p-1">
        <p className="text-neutral-700 text-center">
          {player.name}
          <span className="text-xs ml-1">さん</span>
        </p>
        <h3 className="text-xl font-semibold text-neutral-700 text-center mt-2">
          ご参加ありがとうございます!
        </h3>
        <p className="text-neutral-700 mt-12">
          進行にしたがってスライドを見ながらクイズに回答してください。
        </p>
      </div>
      <div className="grow flex items-end py-6">
        <Link href={`/question/${player.next_question_id}`}>
          <button
            className="border-2 border-emerald-700 text-white rounded bg-emerald-700 hover:border-emerald-700 hover:bg-white 
            hover:text-emerald-700 font-semibold text-lg tracking-wide shadow-md shadow-emerald-900/40 active:shadow-none py-2 px-6"
          >
            第1問に進む
          </button>
        </Link>
      </div>
    </main>
  );
};
