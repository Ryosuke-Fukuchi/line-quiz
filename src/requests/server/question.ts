import { supabase } from "@/utils/supabase";
import { QuestionType } from "@/types/questionTypes";

export async function getQuestion(questionId: string): Promise<QuestionType> {
  const { data, error } = await supabase
    .from("Question")
    .select(
      `
          id,
          content,
          question_type,
          question_number,
          quiz_id,
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
    .eq("id", questionId);

  if (error || !data || data.length === 0) {
    console.error("Error occurred:", error);
    throw new Error("Error fetching question data");
  }

  return data[0] as unknown as QuestionType;
}
