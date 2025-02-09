import React from "react";
import { QuestionSelectContent } from "./QuestionSelectContent";
import { QuestionSortContent } from "./QuestionSortContent";
import { QUESTION_TYPE } from "@/const.ts/question";
import {
  QuestionSelectType,
  QuestionSortType,
  QuestionType,
} from "@/types/questionTypes";

type PropsType = {
  question: QuestionType;
};

export const QuestionContent: React.FC<PropsType> = ({ question }) => {
  switch (question.question_type) {
    case QUESTION_TYPE.select:
      return (
        <QuestionSelectContent
          question={question}
          questionSelect={question.questionselect as QuestionSelectType}
        />
      );
    case QUESTION_TYPE.sort:
      return (
        <QuestionSortContent
          question={question}
          questionSort={question.questionsort as QuestionSortType}
        />
      );
    default:
      return <></>;
  }
};
