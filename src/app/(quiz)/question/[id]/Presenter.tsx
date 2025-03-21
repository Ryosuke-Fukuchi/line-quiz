import { QUESTION_TYPE } from "@/const/question";
import { PlayerAnswerPayloadType } from "@/types/playerTypes";
import {
  QuestionSelectType,
  QuestionSortType,
  QuestionType,
} from "@/types/questionTypes";
import { QuestionSelectContainer } from "./f_QuestionSelect/Container";
import { QuestionSortContainer } from "./f_QuestionSort/Container";
import { motion } from "framer-motion";

export const QuestionPresenter: React.FC<{
  question: QuestionType;
  createAnswer: (playeranswer: PlayerAnswerPayloadType) => Promise<void>;
}> = ({ question, createAnswer }) => {
  return (
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
  );
};

const QuestionContent: React.FC<{
  question: QuestionType;
  createAnswer: (playeranswer: PlayerAnswerPayloadType) => Promise<void>;
}> = ({ question, createAnswer }) => {
  switch (question.question_type) {
    case QUESTION_TYPE.select:
      return (
        <QuestionSelectContainer
          questionSelect={question.questionselect as QuestionSelectType}
          createAnswer={createAnswer}
        />
      );
    case QUESTION_TYPE.sort:
      return (
        <QuestionSortContainer
          questionSort={question.questionsort as QuestionSortType}
          createAnswer={createAnswer}
        />
      );
    default:
      return <></>;
  }
};
