"use client";

import React from "react";
import { QuestionSelectType } from "@/types/questionTypes";
import { PlayerAnswerPayloadType } from "@/types/playerTypes";
import { ChoiceType } from "./types";
import { QuestionSelectPresenter } from "./Presenter";

type PropsType = {
  questionSelect: QuestionSelectType;
  createAnswer: (playeranswer: PlayerAnswerPayloadType) => Promise<void>;
};

export const QuestionSelectContainer: React.FC<PropsType> = ({
  questionSelect,
  createAnswer,
}) => {
  const options = questionSelect.questionselectchoice_set
    .map((choice) => ({ ...choice, pk: choice.id, value: choice.content }))
    .sort((a, b) => a.sort_order - b.sort_order);

  const [selected, setSelected] = React.useState<ChoiceType[]>([]);
  const [answered, setAnswered] = React.useState(false);

  const selectChoice = (selected: ChoiceType) => {
    setSelected((current) => {
      if (current.find((item) => selected.pk === item.pk)) {
        return current.filter((item) => selected.pk !== item.pk);
      }

      if (current.length === questionSelect.select_counts) {
        return [...[...current].slice(1), selected];
      }

      return [...current, selected];
    });
  };

  const handleAnswer = async () => {
    setAnswered(true);

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
    <QuestionSelectPresenter
      options={options}
      selected={selected}
      selectChoice={selectChoice}
      handleAnswer={handleAnswer}
      isReady={selected.length === questionSelect.select_counts}
      isAnswered={answered}
    />
  );
};
