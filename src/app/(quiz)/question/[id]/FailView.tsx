"use client";

import Link from "next/link";

const buttonStyle =
  "border-2 border-emerald-700 text-white rounded-md bg-emerald-700 hover:border-emerald-700 hover:bg-white hover:text-emerald-700 font-semibold text-xl tracking-wide shadow-md shadow-emerald-900/40 active:shadow-none py-2 px-6";

export const AnswerFailView: React.FC<{
  message: string;
  playerPublicId: string;
  questionNumber: number;
  nextQuestionPublicId: string;
  allAnswered: boolean;
}> = ({
  message,
  playerPublicId,
  questionNumber,
  nextQuestionPublicId,
  allAnswered,
}) => {
  return (
    <main className="min-h-screen p-8 pb-20 flex flex-col items-center">
      <div className="p-1">
        <p className="text-neutral-700 text-center mt-4">{message}</p>
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
    </main>
  );
};
