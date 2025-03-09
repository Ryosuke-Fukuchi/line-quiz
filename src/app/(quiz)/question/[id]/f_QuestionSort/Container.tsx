import React from "react";
import { QuestionSortType } from "@/types/questionTypes";
import { PlayerAnswerPayloadType } from "@/types/playerTypes";
import { QuestionSortPresenter } from "./Presenter";

type ChoiceType = { pk: number; value: string; correct_sort_order: number };

type PropsType = {
  questionSort: QuestionSortType;
  createAnswer: (playeranswer: PlayerAnswerPayloadType) => Promise<void>;
};

export const QuestionSortContainer: React.FC<PropsType> = ({
  questionSort,
  createAnswer,
}) => {
  const options = questionSort.questionsortchoice_set
    .map((choice) => ({ ...choice, pk: choice.id, value: choice.content }))
    .sort((a, b) => a.display_sort_order - b.display_sort_order);

  const [selected, setClicked] = React.useState<ChoiceType[]>([]);
  const [answered, setAnswered] = React.useState(false);

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

  const handleAnswer = async () => {
    setAnswered(true);

    const selectedValues = selected.map((item) => item.value);
    // 正解数
    const correctCounts = selected.filter(
      (item, i) => item.correct_sort_order === i + 1
    ).length;
    // 全問正解かどうか
    const isPerfect = correctCounts === options.length;
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
    <QuestionSortPresenter
      options={options}
      selected={selected}
      selectChoice={selectChoice}
      handleAnswer={handleAnswer}
      isReady={selected.length === options.length}
      isAnswered={answered}
    />
  );
};
