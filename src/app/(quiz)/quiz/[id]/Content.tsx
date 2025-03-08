"use client";

import { useState } from "react";
import { ButtonArea } from "./ButtonArea";
import { useAuthPlayer } from "./useAuthPlayer";
import { QuizType } from "@/types/quizTypes";
import { PlayerType } from "@/types/playerTypes";
import { createPlayer } from "./createPlayer";
import { JoinSuccessView } from "./SuccessView";
import { ScreenLoading } from "@/components/loading/ScreenLoading";
import { useGlobalError } from "@/hooks/useGlobalError";

export const QuizContent: React.FC<{ quiz: QuizType }> = ({ quiz }) => {
  const { player, loading } = useAuthPlayer(quiz);
  const [updatePlayer, setUpdatePlayer] = useState<PlayerType | null>(null);
  const [updating, setUpdating] = useState(false);
  const { setError } = useGlobalError();

  // playerの作成
  const join = async () => {
    setUpdating(true);

    const nextQuestionId = quiz.question_set.find(
      (q) => q.question_number === 1
    )?.public_id as string;

    try {
      const updatedPlayer = await createPlayer({
        quiz_id: quiz.id,
        next_question_id: nextQuestionId,
      });

      setUpdatePlayer(updatedPlayer); // 更新後のplayerをセット

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e);
    }

    setUpdating(false);
  };

  if (loading) {
    return <ScreenLoading />;
  }

  return (
    <>
      {updating && <ScreenLoading />}
      {updatePlayer ? (
        <JoinSuccessView player={updatePlayer} />
      ) : (
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
            <ButtonArea player={player} join={join} updating={updating} />
          </div>
        </>
      )}
    </>
  );
};
