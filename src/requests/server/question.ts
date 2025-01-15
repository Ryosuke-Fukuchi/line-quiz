import { supabase } from "@/utils/supabase";
import { QuestionType } from "@/types/questionTypes";

export async function getQuestion(
  questionPublicId: string
): Promise<QuestionType | null> {
  const { data, error } = await supabase
    .from("Question")
    .select(
      `
          id,
          public_id,
          content,
          question_type,
          question_number,
          quiz:Quiz (
            id,
            question_set:Question (
              public_id,
              question_number
            )
          ),
          questionselect:QuestionSelect (
            id,
            answer_points,
            additional_points,
            select_counts,
            questionselectchoice_set:QuestionSelectChoice (
              id,
              content,
              is_answer,
              sort_order
            )
          ),
          questionsort:QuestionSort (
            id,
            answer_points,
            additional_points,
            questionsortchoice_set:QuestionSortChoice (
              id,
              content,
              display_sort_order,
              correct_sort_order
            )
          )
        `
    )
    .eq("public_id", questionPublicId);

  if (error || !data || data.length === 0) {
    return null; // 非正規のアクセスの場合はthrow errorではなくnullを返す
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return data[0] as any;
}
