export type QuizType = {
  id: number;
  title: string;
  description: string;
  question_set: { id: number; question_number: number }[];
};
