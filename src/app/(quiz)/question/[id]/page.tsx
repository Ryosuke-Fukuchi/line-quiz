import { QuestionContent } from "@/features/question/[id]/QuestionContent";
import { getQuestion } from "@/requests/server/question";
import { notFound } from "next/navigation";

export default async function QuestionContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: questionId } = await params;
  const question = await getQuestion(questionId);

  if (!question) {
    notFound();
  }

  const isLastQuestion =
    question?.question_number === question.quiz.question_set.length;

  return (
    <main className="min-h-screen px-8 py-4 pb-20 flex flex-col">
      <div className="p-1">
        <h3 className="text-lg font-semibold text-neutral-700 text-center">
          第{question.question_number}問!
        </h3>
      </div>
      <QuestionContent question={question} isLastQuestion={isLastQuestion} />
    </main>
  );
}
