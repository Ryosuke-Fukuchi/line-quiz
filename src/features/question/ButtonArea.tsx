"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { patchPlayer, PlayerType } from "@/requests/player";
import Link from "next/link";
import { PLAYER_STATUS } from "@/const.ts/player";

type PropsType = {
  player: PlayerType;
  refetchPlayer?: () => Promise<void>;
};

export const ButtonArea: React.FC<PropsType> = ({ player, refetchPlayer }) => {
  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const toResultPage = async () => {
    setLoading(true);
    await patchPlayer(player.id, { status: PLAYER_STATUS.result_confirmed });
    await refetchPlayer?.();
    router.push(`/player_result/${player.user_id}`);
    setLoading(false);
  };

  return (
    <>
      {player.status === PLAYER_STATUS.playing ? (
        <Link href={`/question/${player.next_question_id}`}>
          <button
            className="border-2 border-emerald-700 text-white rounded bg-emerald-700 hover:border-emerald-700 hover:bg-white 
        hover:text-emerald-700 font-semibold text-lg tracking-wide shadow-md shadow-emerald-900/40 active:shadow-none py-2 px-6"
          >
            第{player.question_number}問に進む
          </button>
        </Link>
      ) : (
        <button
          className="border-2 border-emerald-700 text-white rounded bg-emerald-700 hover:border-emerald-700 hover:bg-white 
        hover:text-emerald-700 font-semibold text-lg tracking-wide shadow-md shadow-emerald-900/40 active:shadow-none py-2 px-6"
          onClick={toResultPage}
        >
          {loading ? "loading..." : "結果を見る!"}
        </button>
      )}
    </>
  );
};
