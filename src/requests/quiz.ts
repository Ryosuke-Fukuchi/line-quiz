export type QuizType = {
  id: number;
  title: string;
  description: string;
  question_set: { id: number }[];
};

export async function getQuiz(): Promise<QuizType> {
  const res = await fetch("http://localhost:3000/api/quiz");
  return res.json();
}
