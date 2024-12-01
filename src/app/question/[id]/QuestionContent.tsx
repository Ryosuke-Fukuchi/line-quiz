"use client";
import React from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type ChoiceType = { pk: number; value: string; is_answer: boolean };

type PropsType = {
  choices: ChoiceType[];
  questionMeta: {
    questionNumber: number;
    answerPoints: number;
    additionalPoints: number;
    selectCounts: number;
  };
};

export const QuestionContent: React.FC<PropsType> = ({
  choices,
  questionMeta: {
    questionNumber,
    answerPoints,
    additionalPoints,
    selectCounts,
  },
}) => {
  const [selected, setClicked] = React.useState<ChoiceType[]>([]);
  const router = useRouter();

  const selectChoice = (selected: ChoiceType) => {
    setClicked((current) => {
      if (current.find((item) => selected.pk === item.pk)) {
        return current.filter((item) => selected.pk !== item.pk);
      }

      if (current.length === selectCounts) {
        return [...[...current].slice(1), selected];
      }

      return [...current, selected];
    });
  };

  const handleAnswer = () => {
    const selectedValues = selected.map((item) => item.value);
    const correctCounts = selected.filter((item) => item.is_answer).length;
    const isPerfect = correctCounts === selectCounts;
    const earnedPoints =
      answerPoints * correctCounts + (isPerfect ? additionalPoints : 0);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const payload = {
      content: JSON.stringify(selectedValues),
      earned_points: earnedPoints,
      question_number: questionNumber,
    };

    // /questionに遷移
    router.push("/question");
  };

  return (
    <div className="p-4 grow flex flex-col justify-between">
      <div className="p-4 flex flex-col gap-3">
        {choices.map((choice) => (
          <button
            key={choice.pk.toString()}
            type="button"
            className={twMerge(
              "w-full box-border border h-12 border-teal-600 bg-green-50 rounded-full p-2",
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
      <div className="flex justify-center py-6">
        <button
          className={twMerge(
            "border-2 border-zinc-300 bg-zinc-200 text-zinc-400 rounded text-lg tracking-wide py-2 px-6",
            clsx(
              selected.length === selectCounts &&
                "font-semibold border-emerald-700 text-white bg-emerald-700 hover:border-emerald-700 hover:bg-white hover:text-emerald-700 shadow-md shadow-emerald-900/40 active:shadow-none"
            )
          )}
          onClick={handleAnswer}
        >
          回答する
        </button>
      </div>
    </div>
  );
};
