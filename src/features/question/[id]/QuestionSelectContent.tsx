"use client";
import React from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { QUESTION_TYPE } from "@/const.ts/question";
import { createPlayerAnswer, patchPlayer } from "@/requests/client/player";
import { PLAYER_STATUS } from "@/const.ts/player";
import { SpinLoading } from "@/components/loading/SpinLoading";
import { PlayerType } from "@/types/playerTypes";
import { QuestionSelectType, QuestionType } from "@/types/questionTypes";

type ChoiceType = { pk: number; value: string; is_answer: boolean };

type PropsType = {
  questionId: number;
  questionNumber: number;
  question: QuestionSelectType;
  quiz: QuestionType["quiz"];
  player: PlayerType;
  refetchPlayer?: () => Promise<void>;
  isLastQuestion: boolean;
  isDone: boolean;
};

export const QuestionSelectContent: React.FC<PropsType> = ({
  questionId,
  questionNumber,
  question,
  quiz,
  player,
  refetchPlayer,
  isLastQuestion,
  isDone,
}) => {
  const buttonText = isDone ? "回答済み" : "回答する";

  const choices = React.useMemo(
    () =>
      question.questionselectchoice_set
        .map((choice) => ({ ...choice, pk: choice.id, value: choice.content }))
        .sort((a, b) => a.sort_order - b.sort_order),
    [question]
  );

  const [selected, setClicked] = React.useState<ChoiceType[]>([]);
  const router = useRouter();

  const selectChoice = (selected: ChoiceType) => {
    setClicked((current) => {
      if (current.find((item) => selected.pk === item.pk)) {
        return current.filter((item) => selected.pk !== item.pk);
      }

      if (current.length === question.select_counts) {
        return [...[...current].slice(1), selected];
      }

      return [...current, selected];
    });
  };

  const [loading, setLoading] = React.useState(false);

  const handleAnswer = async () => {
    setLoading(true);
    const selectedValues = selected.map((item) => item.value);
    // 正解数
    const correctCounts = selected.filter((item) => item.is_answer).length;
    // 全問正解かどうか
    const isPerfect = correctCounts === question.select_counts;
    // 獲得ポイント
    const earnedPoints =
      question.answer_points * correctCounts +
      (isPerfect ? question.additional_points : 0);

    const answerPayload = {
      content: JSON.stringify(selectedValues),
      question_type: QUESTION_TYPE.select,
      earned_points: earnedPoints,
      question_number: questionNumber,
      question_id: questionId,
    };

    const playerPayload = {
      id: player.id,
      earned_points: player.earned_points + earnedPoints,
      question_number: questionNumber + 1,
      next_question_id: isLastQuestion
        ? null
        : (quiz.question_set[questionNumber + 1]?.id as number),
      status: isLastQuestion ? PLAYER_STATUS.done : PLAYER_STATUS.playing,
    };

    // TODO: 入れ子更新が可能か
    await createPlayerAnswer(player.id, answerPayload);
    await patchPlayer(player.id, playerPayload);
    await refetchPlayer?.();

    // /questionに遷移
    router.push("/question");
    setLoading(false);
  };

  return (
    <div
      className={`p-4 grow flex flex-col justify-between ${
        choices.length > 5 ? "items-center" : ""
      }`}
    >
      {choices.length > 5 ? (
        <div className="py-4 grid grid-cols-3 gap-3 w-fit">
          {choices.map((choice) => (
            <button
              key={choice.pk.toString()}
              type="button"
              className={twMerge(
                "text-lg size-20 box-border border border-teal-600 bg-green-50 rounded-md p-2",
                clsx(
                  selected.find((item) => choice.pk === item.pk) &&
                    "border-3 bg-green-100 font-semibold"
                )
              )}
              onClick={() => {
                selectChoice(choice);
              }}
            >
              {choice.value}
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 flex flex-col gap-3">
          {choices.map((choice) => (
            <button
              key={choice.pk.toString()}
              type="button"
              className={twMerge(
                "w-full text-lg box-border border h-12 border-teal-600 bg-green-50 rounded-full p-2",
                clsx(
                  selected.find((item) => choice.pk === item.pk) &&
                    "border-3 bg-green-100 font-semibold"
                )
              )}
              onClick={() => {
                selectChoice(choice);
              }}
            >
              {choice.value}
            </button>
          ))}
        </div>
      )}
      <div className="flex justify-center py-6">
        <button
          className={twMerge(
            "border-2 border-zinc-300 bg-zinc-200 text-zinc-400 rounded text-lg tracking-wide py-2 px-6",
            clsx(
              selected.length === question.select_counts &&
                !isDone &&
                "font-semibold border-emerald-700 text-white bg-emerald-700 hover:border-emerald-700 hover:bg-white hover:text-emerald-700 shadow-md shadow-emerald-900/40 active:shadow-none"
            )
          )}
          disabled={
            selected.length !== question.select_counts || loading || isDone
          }
          onClick={handleAnswer}
        >
          {loading ? <SpinLoading text="Loading" /> : buttonText}
        </button>
      </div>
    </div>
  );
};
