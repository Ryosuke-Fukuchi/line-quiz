"use client";

import React, { useState } from "react";
import { QuestionType } from "@/types/questionTypes";
import { answer } from "@/app/(quiz)/question/[id]/f_handlers/answer";
import { PlayerAnswerPayloadType } from "@/types/playerTypes";
import { PLAYER_STATUS } from "@/const/player";
import { AnswerSuccessView } from "./SuccessView";
import { AnswerFailView } from "./FailView";
import { AnimatePresence } from "framer-motion";
import { ScreenLoading } from "@/components/loading/ScreenLoading";
import { QuestionPresenter } from "./Presenter";
import { useGlobalError } from "@/hooks/useGlobalError";

export const QuestionMainContainer: React.FC<{
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

  const { setError: setGlobalError } = useGlobalError();

  const [loading, setLoading] = useState(false);

  const createAnswer = async (playeranswer: PlayerAnswerPayloadType) => {
    setLoading(true);
    try {
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setGlobalError(e);
    }
    setLoading(false);
  };

  if (errorState) {
    return <AnswerFailView {...errorState} />;
  }

  return (
    <>
      {loading && <ScreenLoading />}
      <AnimatePresence mode="wait">
        {answerState ? (
          <AnswerSuccessView {...answerState} />
        ) : (
          <QuestionPresenter question={question} createAnswer={createAnswer} />
        )}
      </AnimatePresence>
    </>
  );
};
