"use server";

import { PLAYER_STATUS } from "@/const.ts/player";
import {
  PlayerAnswerPayloadType,
  PlayerAnswerType,
  PlayerType,
} from "@/types/playerTypes";
import { QuestionType } from "@/types/questionTypes";
import { supabase } from "@/utils/supabase";
import { verifyLineUser } from "@/utils/verifyLineUser";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

// 回答の処理
export async function answer({
  question,
  playeranswer,
}: {
  question: QuestionType;
  playeranswer: PlayerAnswerPayloadType;
}) {
  // LINEユーザーの検証
  const { userId } = await validateUser();

  // playerの検索
  const player = await fetchUser(question.quiz.id, userId);

  // question_numberのバリデーション
  if (player.status === PLAYER_STATUS.done) {
    return { player: null, message: "既に回答済みです" };
  }
  if (player.question_number !== question.question_number) {
    return { player: null, message: "既に回答済みです" };
  }

  // playerの更新
  const updatedPlayer = await updatePlayer({
    player,
    question,
    earnedPoints: playeranswer.earned_points,
  });

  // playeranswerの作成
  await createPlayerAnswer({
    ...playeranswer,
    player_id: player.id,
    question_id: question.id,
    question_number: question.question_number,
    question_type: question.question_type,
  });

  return { player: updatedPlayer, message: "" };
}

async function validateUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("liffToken");
  if (!token) {
    // TODO: 401 Unauthorized
    throw new Error("User is not authenticated.");
  }
  const verifyResponse = await verifyLineUser(token.value);

  if (!verifyResponse.ok) {
    if (verifyResponse.status === 401) {
      // TODO: 401 Unauthorized
      throw new Error("User is not authenticated.");
    } else {
      throw new Error("Validate User Failed. Something went wrong.");
    }
  }

  const userData = await verifyResponse.json();
  return { userId: userData.sub }; // LINEユーザーID
}

async function fetchUser(quizId: number, userId: string) {
  const { data, error } = await supabase
    .from("Player")
    .select("*")
    .eq("quiz_id", quizId)
    .eq("user_id", userId);

  if (!data || !data[0] || error) {
    notFound();
  }

  return data[0];
}

async function updatePlayer({
  player,
  question,
  earnedPoints,
}: {
  player: Omit<PlayerType, "playeranswer_set">;
  question: QuestionType;
  earnedPoints: number;
}) {
  const isLastQuestion =
    question?.question_number === question.quiz.question_set.length;

  const newQuestionNumber = question.question_number + 1;

  const nextQuestionId = isLastQuestion
    ? null
    : (question.quiz.question_set.find(
        (q) => q.question_number === newQuestionNumber
      )?.public_id as string);

  const newStatus = isLastQuestion ? PLAYER_STATUS.done : PLAYER_STATUS.playing;

  const playerPayload = {
    earned_points: player.earned_points + earnedPoints,
    question_number: newQuestionNumber,
    next_question_id: nextQuestionId,
    status: newStatus,
  };

  // playerの更新
  const { data, error } = await supabase
    .from("Player")
    .update({ ...playerPayload })
    .eq("id", player.id)
    .select("*");

  if (error || !data || !data[0]) {
    console.error("Error occurred:", error);
    throw new Error("Update Player Failed. Something went wrong.");
  }

  return data[0] as {
    public_id: string;
    status: string;
    next_question_id: string | null;
  };
}

async function createPlayerAnswer(playeranswer: Omit<PlayerAnswerType, "id">) {
  const { error } = await supabase
    .from("PlayerAnswer")
    .insert({ ...playeranswer });

  if (error) {
    console.error("Error occurred:", error);
    throw new Error("Create PlayerAnswer Failed. Something went wrong.");
  }
}
