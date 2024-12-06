import { ButtonArea } from "@/features/player_result/[id]/ButtonArea";
import { getPlayer } from "@/requests/player";
import { notFound } from "next/navigation";

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: userId } = await params;
  const player = await getPlayer(userId);

  if (!player) {
    notFound();
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
