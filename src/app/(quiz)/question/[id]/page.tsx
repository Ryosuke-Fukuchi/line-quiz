import { QuestionMainContent } from "./Content";
import { getQuestion } from "@/requests/server/question";
import { notFound } from "next/navigation";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: questionPublicId } = await params;
  const question = await getQuestion(questionPublicId);

  if (!question) {
    notFound();
  }

  return (
    <main className="relative overflow-hidden">
      <QuestionMainContent question={question} />
    </main>
  );
}
