import { getPlayers } from "@/requests/server/player";
import { getQuizByPublicId } from "@/requests/server/quiz";
import { notFound } from "next/navigation";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: quizPublicId } = await params;
  const quiz = await getQuizByPublicId(quizPublicId);
  if (!quiz) {
    notFound();
  }
  const players = await getPlayers(quiz.id);
  return (
    <main className="min-h-screen p-8 pb-20">
      <div className="p-1">
        <h1 className="text-2xl font-bold tracking-wider text-neutral-700 text-center">
          {quiz.title}
        </h1>
      </div>
      <p className="tracking-wider text-neutral-700 text-center mt-6">
        参加者数
        <span className="px-2 font-semibold text-xl">{players.length}</span>
      </p>
      <div className="flex justify-center mt-6">
        <table className="table-auto">
          <thead>
            <tr className="*:border *:border-black *:px-4 *:py-2">
              <th>Name</th>
              <th>Status</th>
              <th>Question_Number</th>
              <th>Points</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player) => (
              <tr
                key={player.id}
                className="*:border *:border-black *:px-4 *:py-2 *:text-center *:text-sm"
              >
                <td>{player.name}</td>
                <td>{player.status}</td>
                <td>{player.question_number}</td>
                <td>{player.earned_points}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
