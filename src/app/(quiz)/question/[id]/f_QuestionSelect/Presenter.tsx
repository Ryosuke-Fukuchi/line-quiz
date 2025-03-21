"use client";

import React from "react";
import { tv } from "tailwind-variants";
import { ChoiceType, OptionType } from "./types";

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

type PropsType = {
  options: OptionType[];
  selected: ChoiceType[];
  selectChoice: (selected: ChoiceType) => void;
  handleAnswer: () => Promise<void>;
  isReady: boolean;
  isAnswered: boolean;
};

export const QuestionSelectPresenter: React.FC<PropsType> = ({
  options,
  selected,
  selectChoice,
  handleAnswer,
  isReady,
  isAnswered,
}) => {
  return (
    <div
      className={`p-4 grow flex flex-col justify-between ${
        options.length > 5 ? "items-center" : ""
      }`}
    >
      {options.length > 5 ? (
        <div className="py-4 grid grid-cols-3 gap-3 w-fit">
          {options.map((option) => (
            <button
              key={option.pk.toString()}
              type="button"
              className={choiceStyle1({
                selected: selected.some((item) => option.pk === item.pk),
              })}
              onClick={() => {
                selectChoice(option);
              }}
            >
              {option.value}
            </button>
          ))}
        </div>
      ) : (
        <div className="p-4 flex flex-col gap-3">
          {options.map((option) => (
            <button
              key={option.pk.toString()}
              type="button"
              className={choiceStyle2({
                selected: selected.some((item) => option.pk === item.pk),
              })}
              onClick={() => {
                selectChoice(option);
              }}
            >
              {option.value}
            </button>
          ))}
        </div>
      )}
      <div className="flex justify-center py-6">
        <button
          className={buttonStyle({
            ready: isReady,
          })}
          disabled={!isReady || isAnswered}
          onClick={handleAnswer}
        >
          回答する
        </button>
      </div>
    </div>
  );
};
