import { JoinButton } from "@/features/home/JoinButton";
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
        <JoinButton quiz={quiz} />
      </div>
    </main>
  );
}
