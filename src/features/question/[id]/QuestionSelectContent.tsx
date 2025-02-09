"use client";
import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { QUESTION_TYPE } from "@/const.ts/question";
import { SpinLoading } from "@/components/loading/SpinLoading";
import { QuestionSelectType, QuestionType } from "@/types/questionTypes";
import { answer } from "@/requests/client/answer";

type ChoiceType = { pk: number; value: string; is_answer: boolean };

type PropsType = {
  question: QuestionType;
  questionSelect: QuestionSelectType;
};

export const QuestionSelectContent: React.FC<PropsType> = ({
  question,
  questionSelect,
}) => {
  const choices = React.useMemo(
    () =>
      questionSelect.questionselectchoice_set
        .map((choice) => ({ ...choice, pk: choice.id, value: choice.content }))
        .sort((a, b) => a.sort_order - b.sort_order),
    [questionSelect]
  );

  const [selected, setClicked] = React.useState<ChoiceType[]>([]);

  const selectChoice = (selected: ChoiceType) => {
    setClicked((current) => {
      if (current.find((item) => selected.pk === item.pk)) {
        return current.filter((item) => selected.pk !== item.pk);
      }

      if (current.length === questionSelect.select_counts) {
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
    const isPerfect = correctCounts === questionSelect.select_counts;
    // 獲得ポイント
    const earnedPoints =
      questionSelect.answer_points * correctCounts +
      (isPerfect ? questionSelect.additional_points : 0);

    const playeranswer = {
      content: JSON.stringify(selectedValues),
      question_type: QUESTION_TYPE.select,
      earned_points: earnedPoints,
      question_number: question.question_number,
      question_id: question.id,
    };

    await answer({ question, playeranswer });

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
              selected.length === questionSelect.select_counts &&
                "font-semibold border-emerald-700 text-white bg-emerald-700 hover:border-emerald-700 hover:bg-white hover:text-emerald-700 shadow-md shadow-emerald-900/40 active:shadow-none"
            )
          )}
          disabled={selected.length !== questionSelect.select_counts || loading}
          onClick={handleAnswer}
        >
          {loading ? <SpinLoading text="Loading" /> : "回答する"}
        </button>
      </div>
    </div>
  );
};
