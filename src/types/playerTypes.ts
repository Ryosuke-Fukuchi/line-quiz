export type PlayerAnswerType = {
  id: number;
  content: string;
  earned_points: number;
  question_type: string;
  question_number: number;
  player_id: number;
  question_id: number;
};

export type PlayerType = {
  id: number;
  name: string;
  user_id: string;
  public_id: string;
  status: string;
  earned_points: number;
  question_number: number;
  quiz_id: number;
  next_question_id: string | null;
  playeranswer_set: PlayerAnswerType[];
};

export type PlayerAnswerPayloadType = {
  content: string;
  earned_points: number;
};
