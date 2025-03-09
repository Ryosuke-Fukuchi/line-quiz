import "server-only";
import { supabase } from "@/utils/supabase";
import { QuizType } from "@/types/quizTypes";
import { notFound } from "next/navigation";
import { isUUIDv4 } from "@/utils/isUUIDv4";

export async function getQuizByPublicId(
  quizPubilcId: string
): Promise<QuizType> {
  if (!isUUIDv4(quizPubilcId)) {
    notFound();
  }

  // クライアントからリクエストを行わないので直supabaseを使う
  const { data, error } = await supabase
    .from("Quiz")
    .select(
      `
        id,
        title,
        description,
        question_set:Question (
          public_id,
          question_number
        )
      `
    )
    .eq("public_id", quizPubilcId);

  if (error) {
    // パラメータがuuidであることを担保されたうえでエラーが起きたらthrow
    throw error;
  }

  if (!data || data.length === 0) {
    notFound();
  }

  return data[0];
}
