import { getQuizPlayers } from "@/requests/server/player";
import { getQuizByPublicId } from "@/requests/server/quiz";
import { AdminContainer } from "./Container";

export default async function AdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: quizPublicId } = await params;
  const quiz = await getQuizByPublicId(quizPublicId);
  const players = await getQuizPlayers(quiz.id);

  return <AdminContainer quiz={quiz} players={players} />;
}
