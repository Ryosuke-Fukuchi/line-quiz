import { QuestionContent } from "@/features/question/[id]/QuestionContent";
import { getQuestion } from "@/requests/question";
import { getQuiz } from "@/requests/quiz";
import { supabase } from "@/utils/supabase";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const { data, error } = await supabase
    .from("Quiz")
    .select(
      `
    id,
    title,
    description,
    question_set:Question (
      id
    )
  `
    )
    .eq("id", process.env.QUIZ_ID);
  // const quiz = await getQuiz();

  if (!data || error) {
    throw new Error("Failed to fetch quiz data");
  }

  return data[0].question_set.map((question) => ({
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
  const quiz = await getQuiz();

  if (!question) {
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
      <QuestionContent question={question} isLastQuestion={isLastQuestion} />
    </main>
  );
}
