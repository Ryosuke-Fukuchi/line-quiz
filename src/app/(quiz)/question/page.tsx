"use client";
import { usePlayerContext } from "@/components/provider/PlayerProvider";
import { ButtonArea } from "@/features/question/ButtonArea";

export default function QuestionPage() {
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

  const answer = JSON.parse(
    player.playeranswer_set.find(
      (answer) => answer.question_number === player.question_number - 1
    )?.content ?? "[]"
  ) as string[];

  return (
    <main className="min-h-screen p-8 pb-20 flex flex-col items-center">
      <div className="p-1">
        {player.question_number === 1 ? (
          <>
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
          </>
        ) : (
          <>
            <p className="text-neutral-700 text-center">
              第{player.question_number - 1}問
              <span className="text-sm ml-1">は</span>
            </p>
            <h3 className="text-2xl font-semibold text-neutral-700 text-center mt-2">
              {answer.map((value, i) => (
                <span key={i.toString()} className="mx-2">
                  {value}
                </span>
              ))}
            </h3>
            <p className="text-neutral-700 text-center mt-4">
              と回答しました。
            </p>
          </>
        )}
      </div>
      <div className="grow flex items-end py-6">
        <ButtonArea player={player} playerLoading={playerLoading} />
      </div>
    </main>
  );
}
