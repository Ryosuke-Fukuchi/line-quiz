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
  return <QuizContent quiz={quiz} />;
}
