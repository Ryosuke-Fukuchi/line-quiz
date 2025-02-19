"use client";

import React from "react";
import { SpinLoading } from "@/components/loading/SpinLoading";
import { QuestionSelectType } from "@/types/questionTypes";
import { tv } from "tailwind-variants";
import { PlayerAnswerPayloadType } from "@/types/playerTypes";

const choiceStyle1 = tv({
  base: "text-lg size-20 box-border border border-teal-600 bg-green-50 rounded-md p-2",
  variants: {
    selected: { true: "border-3 bg-green-100 font-semibold" },
  },
});

const choiceStyle2 = tv({
  base: "w-full text-lg box-border border h-12 border-teal-600 bg-green-50 rounded-full p-2",
  variants: {
    selected: { true: "border-3 bg-green-100 font-semibold" },
  },
});

const buttonStyle = tv({
  base: "border-2 border-zinc-300 bg-zinc-200 text-zinc-400 rounded text-lg tracking-wide py-2 px-6",
  variants: {
    ready: {
      true: "font-semibold border-emerald-700 text-white bg-emerald-700 hover:border-emerald-700 hover:bg-white hover:text-emerald-700 shadow-md shadow-emerald-900/40 active:shadow-none",
    },
  },
});

type ChoiceType = { pk: number; value: string; is_answer: boolean };

type PropsType = {
  questionSelect: QuestionSelectType;
  createAnswer: (playeranswer: PlayerAnswerPayloadType) => Promise<void>;
};

export const QuestionSelectContent: React.FC<PropsType> = ({
  questionSelect,
  createAnswer,
}) => {
  const choices = questionSelect.questionselectchoice_set
    .map((choice) => ({ ...choice, pk: choice.id, value: choice.content }))
    .sort((a, b) => a.sort_order - b.sort_order);

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
      earned_points: earnedPoints,
    };

    await createAnswer(playeranswer);
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
              className={choiceStyle1({
                selected: selected.some((item) => choice.pk === item.pk),
              })}
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
              className={choiceStyle2({
                selected: selected.some((item) => choice.pk === item.pk),
              })}
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
          className={buttonStyle({
            ready: selected.length === questionSelect.select_counts,
          })}
          disabled={selected.length !== questionSelect.select_counts || loading}
          onClick={handleAnswer}
        >
          {loading ? <SpinLoading text="Loading" /> : "回答する"}
        </button>
      </div>
    </div>
  );
};
