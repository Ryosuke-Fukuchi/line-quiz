"use client";

import React from "react";
import { SpinLoading } from "@/components/loading/SpinLoading";
import { QuestionSortType } from "@/types/questionTypes";
import { PlayerAnswerPayloadType } from "@/types/playerTypes";
import { tv } from "tailwind-variants";

const buttonStyle = tv({
  base: "border-2 border-zinc-300 bg-zinc-200 text-zinc-400 rounded text-lg tracking-wide py-2 px-6",
  variants: {
    ready: {
      true: "font-semibold border-emerald-700 text-white bg-emerald-700 hover:border-emerald-700 hover:bg-white hover:text-emerald-700 shadow-md shadow-emerald-900/40 active:shadow-none",
    },
  },
});

const choiceStyle = tv({
  base: "text-lg size-20 box-border border border-teal-600 bg-green-50 rounded-md p-2",
  variants: {
    selected: {
      true: "border-3 bg-green-100 font-semibold",
    },
  },
});

const selectedIconStyle = tv({
  base: "text-sm font-semibold size-8 border-2 border-teal-900 bg-white -top-2 -left-2 rounded-full flex justify-center items-center",
  variants: {
    show: {
      true: "absolute",
      false: "hidden",
    },
  },
});

type ChoiceType = { pk: number; value: string; correct_sort_order: number };

type PropsType = {
  questionSort: QuestionSortType;
  createAnswer: (playeranswer: PlayerAnswerPayloadType) => Promise<void>;
};

export const QuestionSortContent: React.FC<PropsType> = ({
  questionSort,
  createAnswer,
}) => {
  const choices = questionSort.questionsortchoice_set
    .map((choice) => ({ ...choice, pk: choice.id, value: choice.content }))
    .sort((a, b) => a.display_sort_order - b.display_sort_order);

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
      earned_points: earnedPoints,
    };

    await createAnswer(playeranswer);
  };

  return (
    <div className="p-4 grow flex flex-col justify-between items-center">
      <div className="py-4 grid grid-cols-3 gap-3 w-fit">
        {choices.map((choice) => (
          <div key={choice.pk.toString()} className="relative">
            {/* 選択順表示アイコン */}
            <div
              className={selectedIconStyle({
                show: selected.some((item) => item.pk === choice.pk),
              })}
            >
              {selected.findIndex((item) => item.pk === choice.pk) + 1}
            </div>
            {/* 選択肢 */}
            <button
              type="button"
              className={choiceStyle({
                selected: selected.some((item) => choice.pk === item.pk),
              })}
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
          className={buttonStyle({ ready: selected.length === choices.length })}
          disabled={selected.length !== choices.length || loading}
          onClick={handleAnswer}
        >
          {loading ? <SpinLoading text="Loading" /> : "回答する"}
        </button>
      </div>
    </div>
  );
};
