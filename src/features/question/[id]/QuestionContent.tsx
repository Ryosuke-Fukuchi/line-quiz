"use client";
import React from "react";
import {
  QuestionSelectType,
  QuestionSortType,
  QuestionType,
} from "@/requests/question";
import { QuestionSelectContent } from "./QuestionSelectContent";
import { QuestionSortContent } from "./QuestionSortContent";
import { QUESTION_TYPE } from "@/const.ts/question";
import { usePlayer } from "@/app/playerProvider";
import { notFound, useRouter } from "next/navigation";
import { PLAYER_STATUS } from "@/const.ts/player";
import { patchPlayer } from "@/requests/player";

type PropsType = {
  question: QuestionType;
  isLastQuestion: boolean;
};

export const QuestionContent: React.FC<PropsType> = ({
  question,
  isLastQuestion,
}) => {
  const { player, refetch } = usePlayer();

  if (!player) {
    notFound();
  }

  const isDone = player.question_number > question.question_number;

  const router = useRouter();
  const moveToNext = async () => {
    if (player.status === PLAYER_STATUS.playing) {
      router.push(`/question/${player.next_question_id}`);
    } else {
      await patchPlayer(player.id, { status: PLAYER_STATUS.result_confirmed });
      await refetch?.();
      router.push(`/player_result/${player.user_id}`);
    }
  };

  const Content = React.useMemo(() => {
    switch (question.question_type) {
      case QUESTION_TYPE.select:
        return (
          <QuestionSelectContent
            questionId={question.id}
            player={player}
            refetchPlayer={refetch}
            questionNumber={question.question_number}
            question={question.questionselect as QuestionSelectType}
            isLastQuestion={isLastQuestion}
            isDone={isDone}
          />
        );
      case QUESTION_TYPE.sort:
        return (
          <QuestionSortContent
            questionId={question.id}
            player={player}
            refetchPlayer={refetch}
            questionNumber={question.question_number}
            question={question.questionsort as QuestionSortType}
            isLastQuestion={isLastQuestion}
            isDone={isDone}
          />
        );
      default:
        return null;
    }
  }, [
    isLastQuestion,
    player,
    question.id,
    question.question_number,
    question.question_type,
    question.questionselect,
    question.questionsort,
    refetch,
    isDone,
  ]);

  return (
    <>
      {Content}
      {isDone && (
        <div className="flex justify-center py-3">
          <button
            className={
              "border-2 font-semibold border-emerald-700 text-white bg-emerald-700 hover:border-emerald-700 hover:bg-white hover:text-emerald-700 shadow-md shadow-emerald-900/40 active:shadow-none rounded text-lg tracking-wide py-2 px-6"
            }
            onClick={moveToNext}
          >
            {player.status === PLAYER_STATUS.playing
              ? `第${player.question_number}問に進む!`
              : "結果を見る!"}
          </button>
        </div>
      )}
    </>
  );
};
