import { QuestionContent } from "./QuestionContent";

export function generateStaticParams() {
  const questions = [{ id: "1" }, { id: "2" }, { id: "3" }];

  return questions.map((question: { id: string }) => ({
    id: question.id,
  }));
}

export default async function QuestionContentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id } = await params;

  const choices = [
    { pk: 1, value: "A", is_answer: false, sort_order: 1 },
    { pk: 2, value: "B", is_answer: true, sort_order: 2 },
    { pk: 3, value: "C", is_answer: false, sort_order: 3 },
    { pk: 4, value: "D", is_answer: false, sort_order: 4 },
    { pk: 5, value: "E", is_answer: false, sort_order: 5 },
  ].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <main className="min-h-screen px-8 py-4 pb-20 flex flex-col">
      <div className="p-1">
        <h3 className="text-lg font-semibold text-neutral-700 text-center">
          第1問!
        </h3>
      </div>
      <QuestionContent
        choices={choices}
        questionMeta={{
          selectCounts: 3,
          answerPoints: 10,
          additionalPoints: 5,
          questionNumber: 1,
        }}
      />
    </main>
  );
}
