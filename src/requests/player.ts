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
  status: string;
  earned_points: number;
  question_number: number;
  quiz_id: number;
  next_question_id: number;
  playeranswer_set: PlayerAnswerType[];
};

export async function getPlayer(userId: string): Promise<PlayerType | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/api/player/` + userId
  );
  if (res.status === 404) {
    return null;
  }
  return res.json();
}

export async function getPlayers(quizId: number): Promise<PlayerType[]> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/api/player/list/${quizId}`
  );
  const data = await res.json();
  return data.players;
}

export async function patchPlayer(
  playerId: number,
  player: Partial<Omit<PlayerType, "next_question_id">>
) {
  await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/player/${playerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(player),
  });
}

export async function createPlayer(
  player: Omit<
    PlayerType,
    | "id"
    | "status"
    | "next_question_id"
    | "earned_points"
    | "question_number"
    | "playeranswer_set"
  >
) {
  await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/player`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(player),
  });
}

export async function createPlayerAnswer(
  playerId: number,
  answer: Omit<PlayerAnswerType, "id" | "player_id">
) {
  await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/player/${playerId}/answer`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(answer),
  });
}
