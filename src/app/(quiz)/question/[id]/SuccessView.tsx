"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const buttonStyle =
  "border-2 border-emerald-700 text-white rounded-md bg-emerald-700 hover:border-emerald-700 hover:bg-white hover:text-emerald-700 font-semibold text-xl tracking-wide shadow-md shadow-emerald-900/40 active:shadow-none py-2 px-6";

export const AnswerSuccessView: React.FC<{
  playerPublicId: string;
  questionNumber: number;
  nextQuestionPublicId: string;
  answerContent: string;
  allAnswered: boolean;
}> = ({
  playerPublicId,
  questionNumber,
  nextQuestionPublicId,
  answerContent,
  allAnswered,
}) => {
  const answer = JSON.parse(answerContent || "[]") as string[];

  return (
    <motion.div
      key="answer-success-view"
      initial={{ x: "100%" }}
      animate={{ x: 0 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="min-h-screen px-8 py-4 pb-20 flex flex-col items-center"
    >
      <div className="p-1">
        <>
          <p className="text-neutral-700 text-center">
            第{questionNumber}問<span className="text-sm ml-1">は</span>
          </p>
          <h3 className="text-2xl font-semibold text-neutral-700 text-center mt-2">
            {answer.map((value, i) => (
              <span key={i.toString()} className="mx-2">
                {value}
              </span>
            ))}
          </h3>
          <p className="text-neutral-700 text-center mt-4">と回答しました。</p>
        </>
      </div>
      <div className="grow flex items-end py-6">
        {allAnswered ? (
          <Link href={`/player_result/${playerPublicId}`}>
            <button className={buttonStyle}>結果を見る!</button>
          </Link>
        ) : (
          <Link href={`/question/${nextQuestionPublicId}`}>
            <button className={buttonStyle}>
              {`第${questionNumber}問に進む`}
            </button>
          </Link>
        )}
      </div>
    </motion.div>
  );
};
