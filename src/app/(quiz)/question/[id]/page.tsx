import { QuestionMainContainer } from "./Container";
import { getQuestion } from "./getQuestion";

export default async function QuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: questionPublicId } = await params;
  const question = await getQuestion(questionPublicId);

  return (
    <main className="relative overflow-hidden">
      <QuestionMainContainer question={question} />
    </main>
  );
}
