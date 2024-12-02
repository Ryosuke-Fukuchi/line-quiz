export type QuizType = {
  id: number;
  title: string;
  description: string;
};

export async function getQuiz(): Promise<QuizType> {
  const res = await fetch("http://localhost:3000/api/quiz");
  return res.json();
}
