import React from "react";
import { tv } from "tailwind-variants";
import { ChoiceType, OptionType } from "./types";

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

type PropsType = {
  options: OptionType[];
  selected: ChoiceType[];
  selectChoice: (selected: ChoiceType) => void;
  handleAnswer: () => Promise<void>;
  isReady: boolean;
  isAnswered: boolean;
};

export const QuestionSortPresenter: React.FC<PropsType> = ({
  options,
  selected,
  selectChoice,
  handleAnswer,
  isReady,
  isAnswered,
}) => {
  return (
    <div className="p-4 grow flex flex-col justify-between items-center">
      <div className="py-4 grid grid-cols-3 gap-3 w-fit">
        {options.map((option) => (
          <div key={option.pk.toString()} className="relative">
            {/* 選択順表示アイコン */}
            <div
              className={selectedIconStyle({
                show: selected.some((item) => item.pk === option.pk),
              })}
            >
              {selected.findIndex((item) => item.pk === option.pk) + 1}
            </div>
            {/* 選択肢 */}
            <button
              type="button"
              className={choiceStyle({
                selected: selected.some((item) => option.pk === item.pk),
              })}
              onClick={() => {
                selectChoice(option);
              }}
            >
              {option.value}
            </button>
          </div>
        ))}
      </div>
      <div className="flex justify-center py-6">
        <button
          className={buttonStyle({ ready: isReady })}
          disabled={!isReady || isAnswered}
          onClick={handleAnswer}
        >
          回答する
        </button>
      </div>
    </div>
  );
};
