"use client";

import React from "react";
import { QuestionSelectContent } from "./QuestionSelectContent";
import { QuestionSortContent } from "./QuestionSortContent";
import { QUESTION_TYPE } from "@/const.ts/question";
import {
  QuestionSelectType,
  QuestionSortType,
  QuestionType,
} from "@/types/questionTypes";
import { answer } from "@/requests/client/answer";
import { PlayerAnswerPayloadType } from "@/types/playerTypes";

export const QuestionMainContent: React.FC<{
  question: QuestionType;
}> = ({ question }) => {
  const createAnswer = async (playeranswer: PlayerAnswerPayloadType) => {
    await answer({ question, playeranswer });
  };
  return (
    <main className="min-h-screen px-8 py-4 pb-20 flex flex-col">
      <div className="p-1">
        <h3 className="text-lg font-semibold text-neutral-700 text-center">
          第{question.question_number}問!
        </h3>
      </div>
      <QuestionContent question={question} createAnswer={createAnswer} />
    </main>
  );
};

const QuestionContent: React.FC<{
  question: QuestionType;
  createAnswer: (playeranswer: PlayerAnswerPayloadType) => Promise<void>;
}> = ({ question, createAnswer }) => {
  switch (question.question_type) {
    case QUESTION_TYPE.select:
      return (
        <QuestionSelectContent
          questionSelect={question.questionselect as QuestionSelectType}
          createAnswer={createAnswer}
        />
      );
    case QUESTION_TYPE.sort:
      return (
        <QuestionSortContent
          questionSort={question.questionsort as QuestionSortType}
          createAnswer={createAnswer}
        />
      );
    default:
      return <></>;
  }
};
