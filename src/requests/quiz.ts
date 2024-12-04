export type QuizType = {
  id: number;
  title: string;
  description: string;
  question_set: { id: number }[];
};

export async function getQuiz(): Promise<QuizType> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/quiz`);
  return res.json();
}
