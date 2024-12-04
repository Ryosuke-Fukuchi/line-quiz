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

export async function getQuestion(
  questionId: string
): Promise<QuestionType | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/api/question/${questionId}`
  );
  if (res.status === 404) {
    return null;
  }
  return res.json();
}
