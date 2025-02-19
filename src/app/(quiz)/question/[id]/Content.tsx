"use client";

import React, { useState } from "react";
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
import { PLAYER_STATUS } from "@/const.ts/player";
import { AnswerSuccessView } from "./SuccessView";
import { AnswerFailView } from "./FailView";
import { motion, AnimatePresence } from "framer-motion";

export const QuestionMainContent: React.FC<{
  question: QuestionType;
}> = ({ question }) => {
  const [answerState, setAnswerState] = useState<{
    playerPublicId: string;
    questionNumber: number;
    nextQuestionPublicId: string;
    answerContent: string;
    allAnswered: boolean;
  } | null>(null);

  const [errorState, setErrorState] = useState<{
    message: string;
    playerPublicId: string;
    questionNumber: number;
    nextQuestionPublicId: string;
    allAnswered: boolean;
  } | null>(null);

  const createAnswer = async (playeranswer: PlayerAnswerPayloadType) => {
    const { success, player, message } = await answer({
      question,
      playeranswer,
    });

    if (success) {
      setAnswerState({
        playerPublicId: player.public_id,
        questionNumber: player.question_number,
        nextQuestionPublicId: player.next_question_id,
        answerContent: playeranswer.content,
        allAnswered: player.status === PLAYER_STATUS.done,
      });
    } else {
      setErrorState({
        playerPublicId: player.public_id,
        questionNumber: player.question_number,
        nextQuestionPublicId: player.next_question_id,
        allAnswered: player.status === PLAYER_STATUS.done,
        message,
      });
    }
  };

  if (errorState) {
    return <AnswerFailView {...errorState} />;
  }

  return (
    <AnimatePresence mode="wait">
      {answerState ? (
        <AnswerSuccessView {...answerState} />
      ) : (
        <motion.div
          key="question-content"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="min-h-screen px-8 py-4 pb-20 flex flex-col"
        >
          <div className="p-1">
            <h3 className="text-lg font-semibold text-neutral-700 text-center">
              第{question.question_number}問!
            </h3>
          </div>
          <QuestionContent question={question} createAnswer={createAnswer} />
        </motion.div>
      )}
    </AnimatePresence>
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
