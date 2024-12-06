"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { createPlayer } from "@/requests/player";
import { QuizType } from "@/requests/quiz";
import * as liff from "@/requests/liff/authenticate";

type PropsType = {
  quiz: QuizType;
};

export const JoinButton: React.FC<PropsType> = ({ quiz }) => {
  const [authenticated, setAuthenticated] = React.useState(false);

  const authenticate = React.useCallback(async () => {
    const accessToken = "liffState?.getAccessToken()";
    const isValid = await liff.authenticate(accessToken);
    setAuthenticated(isValid);
  }, []);

  React.useEffect(() => {
    if (authenticated) return;
    authenticate();
  }, [authenticated, authenticate]);

  const router = useRouter();

  const [loading, setLoading] = React.useState(false);

  const handleJoin = async () => {
    setLoading(true);
    await createPlayer({ name: "Ryosukex", user_id: "xxx", quiz_id: quiz.id });
    router.push("/question");
    setLoading(false);
  };

  return (
    <button
      className="border-2 border-emerald-700 text-white rounded-md bg-emerald-700 hover:border-emerald-700 hover:bg-white 
hover:text-emerald-700 font-semibold text-xl tracking-wide shadow-md shadow-emerald-900/40 active:shadow-none py-2 px-6"
      onClick={handleJoin}
      disabled={loading || !authenticated}
    >
      {loading || !authenticated ? "loading..." : "クイズに参加する!"}
    </button>
  );
};
