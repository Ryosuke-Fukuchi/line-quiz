import { supabase } from "@/utils/supabase";

export type QuizType = {
  id: number;
  title: string;
  description: string;
  question_set: { id: number }[];
};

export async function getQuiz(): Promise<QuizType> {
  const { data, error } = await supabase
    .from("Quiz")
    .select(
      `
    id,
    title,
    description,
    question_set:Question (
      id
    )
  `
    )
    .eq("id", process.env.QUIZ_ID);

  if (error || !data || data.length === 0) {
    console.error("Error occurred:", error);
    throw new Error("Error fetching quiz data");
  }

  return data[0];
}

export async function getQuizForAdmin(): Promise<QuizType> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/quiz`, {
    cache: "no-store",
  });
  return res.json();
}
