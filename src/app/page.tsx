import Link from "next/link";
import { getQuiz } from "@/requests/quiz";

export default async function Home() {
  const quiz = await getQuiz();
  return (
    <main className="min-h-screen p-8 pb-20 flex flex-col items-center">
      <div className="p-1">
        <h1 className="text-4xl font-bold tracking-wider text-neutral-700 text-center">
          {quiz.title}
        </h1>
        <p className="text-neutral-800 whitespace-pre-line mt-12">
          {quiz.description}
        </p>
      </div>
      <div className="grow flex justify-center items-center">
        <Link href="/question">
          <button
            className="border-2 border-emerald-700 text-white rounded-md bg-emerald-700 hover:border-emerald-700 hover:bg-white 
        hover:text-emerald-700 font-semibold text-xl tracking-wide shadow-md shadow-emerald-900/40 active:shadow-none py-2 px-6"
          >
            クイズに参加する!
          </button>
        </Link>
      </div>
      <Link href="/player_result">result</Link>
    </main>
  );
}
