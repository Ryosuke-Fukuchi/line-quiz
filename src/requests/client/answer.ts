"use server";

import { PLAYER_STATUS } from "@/const/player";
import {
  PlayerAnswerPayloadType,
  PlayerAnswerType,
  PlayerType,
} from "@/types/playerTypes";
import { QuestionType } from "@/types/questionTypes";
import CustomError from "@/utils/CustomError";
import { supabase } from "@/utils/supabase";
import { verifyLineUser } from "@/utils/verifyLineUser";
import { cookies } from "next/headers";

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
  const player = await fetchPlayer(question.quiz.id, userId);

  if (!player) {
    // playerが存在しない場合は回答の権限がない、という解釈で403を返す
    throw new CustomError({
      message: "Player not found",
      statusCode: 403,
    });
  }

  // question_numberのバリデーション
  if (player.status === PLAYER_STATUS.done) {
    return {
      success: false,
      player: {
        public_id: player.public_id,
        question_number: player.question_number,
        next_question_id: player.next_question_id || "",
        status: player.status,
      },
      message: "回答済みの問題です",
    };
  }

  if (player.question_number !== question.question_number) {
    return {
      success: false,
      player: {
        public_id: player.public_id,
        question_number: player.question_number,
        next_question_id: player.next_question_id || "",
        status: player.status,
      },
      message: "回答済みの問題です",
    };
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

  return {
    success: true,
    player: {
      public_id: updatedPlayer.public_id,
      question_number: updatedPlayer.question_number,
      next_question_id: updatedPlayer.next_question_id || "",
      status: updatedPlayer.status,
    },
    message: "",
  };
}

async function validateUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get("liffToken");

  if (!token) {
    throw new CustomError({
      message: "Token is not found",
      statusCode: 401,
    });
  }

  const verifyResponse = await verifyLineUser(token.value);

  if (!verifyResponse.ok) {
    if (verifyResponse.status === 401) {
      throw new CustomError({
        message: "User is not authenticated",
        statusCode: 401,
      });
    }

    throw new CustomError({
      message: "Something went wrong on verifying user",
      statusCode: 500,
    });
  }

  const userData = await verifyResponse.json();
  return { userId: userData.sub, name: userData.name }; // LINEユーザーID
}

async function fetchPlayer(quizId: number, userId: string) {
  const { data, error } = await supabase
    .from("Player")
    .select("*")
    .eq("quiz_id", quizId)
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  if (!data || !data[0]) {
    return null;
  }

  return data[0] as Omit<PlayerType, "playeranswer_set">;
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

  if (error) {
    throw error;
  }

  if (!data || !data[0]) {
    throw new CustomError({
      message: "Something went wrong when updating player",
      statusCode: 500,
    });
  }

  return data[0] as Omit<PlayerType, "playeranswer_set">;
}

async function createPlayerAnswer(playeranswer: Omit<PlayerAnswerType, "id">) {
  const { error } = await supabase
    .from("PlayerAnswer")
    .insert({ ...playeranswer });

  if (error) {
    throw error;
  }
}
