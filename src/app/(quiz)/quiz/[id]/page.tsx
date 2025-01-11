import { ButtonArea } from "@/features/home/ButtonArea";
import { getQuizByPublicId } from "@/requests/server/quiz";
import { notFound } from "next/navigation";

export default async function Home({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: quizPublicId } = await params;
  const quiz = await getQuizByPublicId(quizPublicId);
  if (!quiz) {
    notFound();
  }
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
        <ButtonArea quiz={quiz} />
      </div>
    </main>
  );
}
