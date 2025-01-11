"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { patchPlayer } from "@/requests/client/player";
import { PlayerType } from "@/types/playerTypes";
import Link from "next/link";
import { PLAYER_STATUS } from "@/const.ts/player";
import { SpinLoading } from "@/components/loading/SpinLoading";

type PropsType = {
  player: PlayerType;
  playerLoading: boolean;
  refetchPlayer?: () => Promise<void>;
};

export const ButtonArea: React.FC<PropsType> = ({
  player,
  playerLoading,
  refetchPlayer,
}) => {
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
            disabled={loading || playerLoading}
          >
            {loading || playerLoading ? (
              <SpinLoading text="Loading" />
            ) : (
              `第${player.question_number}問に進む`
            )}
          </button>
        </Link>
      ) : (
        <button
          className="border-2 border-emerald-700 text-white rounded bg-emerald-700 hover:border-emerald-700 hover:bg-white 
        hover:text-emerald-700 font-semibold text-lg tracking-wide shadow-md shadow-emerald-900/40 active:shadow-none py-2 px-6"
          onClick={toResultPage}
          disabled={loading || playerLoading}
        >
          {loading || playerLoading ? (
            <SpinLoading text="Loading" />
          ) : (
            "結果を見る!"
          )}
        </button>
      )}
    </>
  );
};
