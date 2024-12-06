import { supabase } from "@/utils/supabase";

export type QuestionSelectType = {
  id: number;
  answer_points: number;
  additional_points: number;
  select_counts: number;
  questionselectchoice_set: {
    id: number;
    content: string;
    is_answer: boolean;
    sort_order: number;
  }[];
};

export type QuestionSortType = {
  id: number;
  answer_points: number;
  additional_points: number;
  questionsortchoice_set: {
    id: number;
    content: string;
    display_sort_order: number;
    correct_sort_order: number;
  }[];
};

export type QuestionType = {
  id: number;
  content: string;
  question_type: string;
  question_number: number;
  questionselect: QuestionSelectType | null;
  questionsort: QuestionSortType | null;
};

export async function getQuestion(questionId: string): Promise<QuestionType> {
  const { data, error } = await supabase
    .from("Question")
    .select(
      `
          id,
          content,
          question_type,
          question_number,
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
