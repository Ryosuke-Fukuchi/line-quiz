import { getPlayer } from "@/requests/player";
import { QuestionContent } from "@/features/question/ButtonArea";
import { notFound } from "next/navigation";

export default async function QuestionPage() {
  const player = await getPlayer("xxx");

  if (!player) {
    notFound();
  }

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
              {["A", "B", "C"].map((value, i) => (
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
        <QuestionContent player={player} />
      </div>
    </main>
  );
}
