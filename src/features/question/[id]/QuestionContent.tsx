import React from "react";
import {
  QuestionSelectType,
  QuestionSortType,
  QuestionType,
} from "@/requests/question";
import { QuestionSelectContent } from "./QuestionSelectContent";
import { QuestionSortContent } from "./QuestionSortContent";
import { QUESTION_TYPE } from "@/const.ts/question";
import { PlayerType } from "@/requests/player";

type PropsType = {
  question: QuestionType;
  player: PlayerType;
  isLastQuestion: boolean;
};

export const QuestionContent: React.FC<PropsType> = ({
  question,
  player,
  isLastQuestion,
}) => {
  switch (question.question_type) {
    case QUESTION_TYPE.select:
      return (
        <QuestionSelectContent
          questionId={question.id}
          player={player}
          questionNumber={question.question_number}
          question={question.questionselect as QuestionSelectType}
          isLastQuestion={isLastQuestion}
        />
      );
    case QUESTION_TYPE.sort:
      return (
        <QuestionSortContent
          questionId={question.id}
          player={player}
          questionNumber={question.question_number}
          question={question.questionsort as QuestionSortType}
          isLastQuestion={isLastQuestion}
        />
      );
    default:
      return null;
  }
};
