"use client";

import React from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";
import { QUESTION_TYPE } from "@/const.ts/question";
import { SpinLoading } from "@/components/loading/SpinLoading";
import { QuestionSortType, QuestionType } from "@/types/questionTypes";
import { answer } from "@/requests/client/answer";

type ChoiceType = { pk: number; value: string; correct_sort_order: number };

type PropsType = {
  question: QuestionType;
  questionSort: QuestionSortType;
};

export const QuestionSortContent: React.FC<PropsType> = ({
  question,
  questionSort,
}) => {
  const choices = React.useMemo(
    () =>
      questionSort.questionsortchoice_set
        .map((choice) => ({ ...choice, pk: choice.id, value: choice.content }))
        .sort((a, b) => a.display_sort_order - b.display_sort_order),
    [questionSort]
  );

  const [selected, setClicked] = React.useState<ChoiceType[]>([]);

  const selectChoice = (selected: ChoiceType) => {
    setClicked((current) => {
      if (selected.pk === current[current.length - 1]?.pk) {
        return current.slice(0, -1);
      }

      if (current.find((item) => selected.pk === item.pk)) {
        return current;
      }

      return [...current, selected];
    });
  };

  const [loading, setLoading] = React.useState(false);

  const handleAnswer = async () => {
    setLoading(true);
    const selectedValues = selected.map((item) => item.value);
    // 正解数
    const correctCounts = selected.filter(
      (item, i) => item.correct_sort_order === i + 1
    ).length;
    // 全問正解かどうか
    const isPerfect = correctCounts === choices.length;
    // 獲得ポイント
    const earnedPoints =
      questionSort.answer_points * correctCounts +
      (isPerfect ? questionSort.additional_points : 0);

    const playeranswer = {
      content: JSON.stringify(selectedValues),
      question_type: QUESTION_TYPE.sort,
      earned_points: earnedPoints,
      question_number: question.question_number,
      question_id: question.id,
    };

    await answer({ question, playeranswer });
    setLoading(false);
  };

  return (
    <div className="p-4 grow flex flex-col justify-between items-center">
      <div className="py-4 grid grid-cols-3 gap-3 w-fit">
        {choices.map((choice) => (
          <div key={choice.pk.toString()} className="relative">
            {selected.findIndex((item) => item.pk === choice.pk) >= 0 && (
              <div className="absolute text-sm font-semibold size-8 border-2 border-teal-900 bg-white -top-2 -left-2 rounded-full flex justify-center items-center">
                {selected.findIndex((item) => item.pk === choice.pk) + 1}
              </div>
            )}
            <button
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
          </div>
        ))}
      </div>
      <div className="flex justify-center py-6">
        <button
          className={twMerge(
            "border-2 border-zinc-300 bg-zinc-200 text-zinc-400 rounded text-lg tracking-wide py-2 px-6",
            clsx(
              selected.length === choices.length &&
                "font-semibold border-emerald-700 text-white bg-emerald-700 hover:border-emerald-700 hover:bg-white hover:text-emerald-700 shadow-md shadow-emerald-900/40 active:shadow-none"
            )
          )}
          disabled={selected.length !== choices.length || loading}
          onClick={handleAnswer}
        >
          {loading ? <SpinLoading text="Loading" /> : "回答する"}
        </button>
      </div>
    </div>
  );
};
