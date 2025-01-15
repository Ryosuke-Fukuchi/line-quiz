export type QuizType = {
  id: number;
  title: string;
  description: string;
  question_set: { public_id: string; question_number: number }[];
};
