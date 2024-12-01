export type PlayerType = {
  id: number;
  name: string;
  user_id: string;
  status: string;
  earned_points: number;
  question_number: number;
  quiz_id: number;
  next_question_id: number;
};

export async function getPlayer(userId: string): Promise<PlayerType | null> {
  const res = await fetch("http://localhost:3000/api/player/" + userId);
  if (res.status === 404) {
    return null;
  }
  return res.json();
}

export async function patchPlayer(
  playerId: number,
  player: Partial<Omit<PlayerType, "next_question_id">>
) {
  await fetch("http://localhost:3000/api/player/" + playerId, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(player),
  });
}
