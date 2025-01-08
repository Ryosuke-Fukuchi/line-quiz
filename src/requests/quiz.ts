import { supabase } from "@/utils/supabase";

export type QuizType = {
  id: number;
  title: string;
  description: string;
  question_set: { id: number }[];
};

export async function getQuiz(): Promise<QuizType> {
  // クライアントからリクエストを行わないので直supabaseを使う
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

export async function getQuizForAdmin(
  quizPubilcId: string
): Promise<QuizType | null> {
  // クライアントからリクエストを行わないので直supabaseを使う
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
    .eq("public_id", quizPubilcId);

  if (error || !data || data.length === 0) {
    return null; // 非正規のアクセスの場合はthrow errorではなくnullを返す
  }

  return data[0];
}
