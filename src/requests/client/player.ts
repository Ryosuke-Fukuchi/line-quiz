import { PlayerAnswerType, PlayerType } from "@/types/playerTypes";

export async function getPlayer(
  quizId: number
): Promise<{ player: PlayerType | null; success: boolean }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/api/player?q=` + quizId,
    {
      cache: "no-store",
    }
  );

  if (res.status === 404) {
    return { player: null, success: true };
  }

  if (res.status !== 200) {
    return { player: null, success: false };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return { player: res.json() as any, success: true };
}

export async function createPlayer(payload: {
  quiz_id: number;
  next_question_id: string;
}) {
  await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/player`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload),
  });
}

export async function patchPlayer(
  playerId: number,
  player: Partial<PlayerType> & {
    playeranswer?: Omit<PlayerAnswerType, "id" | "player_id">;
  }
) {
  await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/player/${playerId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(player),
  });
}
