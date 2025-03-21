import { getQuizByPublicId } from "@/requests/server/quiz";
import { QuizContainer } from "./Container";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: quizPublicId } = await params;
  const quiz = await getQuizByPublicId(quizPublicId);
  return (
    <main className="min-h-screen p-8 pb-20 flex flex-col items-center">
      <QuizContainer quiz={quiz} />
    </main>
  );
}
