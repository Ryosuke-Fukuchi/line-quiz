import { QuestionContent } from "@/features/question/[id]/QuestionContent";
import { getLineUser } from "@/requests/liff";
import { getPlayer } from "@/requests/player";
import { getQuestion } from "@/requests/question";
import { getQuiz } from "@/requests/quiz";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const quiz = await getQuiz();

  return quiz.question_set.map((question) => ({
    id: question.id.toString(),
  }));
}

export default async function QuestionContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: questionId } = await params;
  const question = await getQuestion(questionId);
  const lineUser = await getLineUser();
  const player = await getPlayer(lineUser?.userId || "");
  const quiz = await getQuiz();

  if (!question || !player) {
    notFound();
  }

  const isLastQuestion = question?.question_number === quiz.question_set.length;

  return (
    <main className="min-h-screen px-8 py-4 pb-20 flex flex-col">
      <div className="p-1">
        <h3 className="text-lg font-semibold text-neutral-700 text-center">
          第{question.question_number}問!
        </h3>
      </div>
      <QuestionContent
        question={question}
        player={player}
        isLastQuestion={isLastQuestion}
      />
    </main>
  );
}
