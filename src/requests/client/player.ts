import { PlayerAnswerType, PlayerType } from "@/types/playerTypes";

export async function getPlayer(userId: string): Promise<PlayerType | null> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_HOST}/api/player/` + userId,
    {
      cache: "no-store",
    }
  );
  if (res.status === 404) {
    return null;
  }
  return res.json();
}

export async function createPlayer(
  player: Omit<
    PlayerType,
    "id" | "status" | "earned_points" | "question_number" | "playeranswer_set"
  >
) {
  await fetch(`${process.env.NEXT_PUBLIC_HOST}/api/player`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(player),
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
