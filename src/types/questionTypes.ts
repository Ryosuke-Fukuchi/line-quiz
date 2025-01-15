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
  public_id: string;
  content: string;
  question_type: string;
  question_number: number;
  quiz: {
    id: number;
    question_set: { public_id: string; question_number: number }[];
  };
  questionselect: QuestionSelectType | null;
  questionsort: QuestionSortType | null;
};
