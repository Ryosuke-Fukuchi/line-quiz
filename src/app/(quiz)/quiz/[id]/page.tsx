import { getQuizByPublicId } from "@/requests/server/quiz";
import { notFound } from "next/navigation";
import { QuizContent } from "./Content";

export default async function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: quizPublicId } = await params;
  const quiz = await getQuizByPublicId(quizPublicId);
  if (!quiz) {
    notFound();
  }
  return (
    <main className="min-h-screen p-8 pb-20 flex flex-col items-center">
      <QuizContent quiz={quiz} />
    </main>
  );
}
