import "server-only";

// lineユーザーの検証
export async function verifyLineUser(idToken: string): Promise<Response> {
  const response = await fetch("https://api.line.me/oauth2/v2.1/verify", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      id_token: idToken,
      client_id: process.env.LINE_CHANNEL_ID || "",
    }),
  });

  return response;
}
