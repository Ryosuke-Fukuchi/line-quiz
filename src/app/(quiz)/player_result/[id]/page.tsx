"use client";
import { usePlayerContext } from "@/components/provider/PlayerProvider";
import { ButtonArea } from "@/features/player_result/[id]/ButtonArea";

export default function ResultPage() {
  const { player, loading: playerLoading } = usePlayerContext();

  if (!player || playerLoading) {
    return (
      <main className="min-h-screen p-8 pb-20 flex flex-col items-center">
        <div className="p-1">
          <div className="flex justify-center items-center">
            <span
              className={`animate-spin-fast rounded-full border-t-emerald-800 border-r-emerald-800 border-b-emerald-800 border-slate-100 w-12 h-12 border-4`}
            ></span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen px-8 py-4 pb-20 flex flex-col items-center justify-between">
      <div className="p-1">
        <h3 className="text-lg font-semibold text-neutral-700 text-center">
          結果発表!
        </h3>
        <p className="text-neutral-800 text-center mt-12">あなたの得点は...</p>
        <div className="mt-12">
          <p className="font-bold text-center">
            <span className="text-5xl text-emerald-700 mr-2">
              {player.earned_points}
            </span>
            点
          </p>
        </div>
        <p className="text-neutral-800 text-center mt-12">
          ご参加ありがとうございました！
        </p>
      </div>
      <ButtonArea />
    </main>
  );
}
