"use client";
import { ButtonArea } from "@/features/quiz/[id]/ButtonArea";
import { useAuthPlayer } from "@/hooks/useAuthPlayer";
import { QuizType } from "@/types/quizTypes";

export const QuizContent: React.FC<{ quiz: QuizType }> = ({ quiz }) => {
  const { player, error, loading } = useAuthPlayer();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>エラーが発生しました</div>;
  }

  return (
    <>
      <div className="p-1">
        <h1 className="text-4xl font-bold tracking-wider text-neutral-700 text-center">
          {quiz.title}
        </h1>
        <p className="text-neutral-800 whitespace-pre-line mt-12">
          {quiz.description}
        </p>
      </div>
      <div className="grow flex justify-center items-center">
        <ButtonArea quiz={quiz} player={player} />
      </div>
    </>
  );
};
