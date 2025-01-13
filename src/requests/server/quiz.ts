import { supabase } from "@/utils/supabase";
import { QuizType } from "@/types/quizTypes";

export async function getQuiz(quizId: number): Promise<QuizType> {
  // クライアントからリクエストを行わないので直supabaseを使う
  const { data, error } = await supabase
    .from("Quiz")
    .select(
      `
    id,
    title,
    description,
    question_set:Question (
      id,
      question_number
    )
  `
    )
    .eq("id", quizId);

  if (error || !data || data.length === 0) {
    console.error("Error occurred:", error);
    throw new Error("Error fetching quiz data");
  }

  return data[0];
}

export async function getQuizByPublicId(
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
        id,
        question_number
      )
    `
    )
    .eq("public_id", quizPubilcId);

  if (error || !data || data.length === 0) {
    return null; // 非正規のアクセスの場合はthrow errorではなくnullを返す
  }

  return data[0];
}
