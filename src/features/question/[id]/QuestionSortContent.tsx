"use client";
import React from "react";
import { QuestionSortType } from "@/requests/question";
import { PlayerType } from "@/requests/player";

// type ChoiceType = { pk: number; value: string; is_answer: boolean };

type PropsType = {
  questionId: number;
  questionNumber: number;
  question: QuestionSortType;
  player: PlayerType;
  isLastQuestion: boolean;
};

export const QuestionSortContent: React.FC<PropsType> = () => {
  return <div className="p-4 grow flex flex-col justify-between"></div>;
};
