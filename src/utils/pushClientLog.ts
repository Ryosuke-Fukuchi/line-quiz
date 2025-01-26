import "client-only";

export async function pushClientLog(message: string | object) {
  try {
    const body = typeof message === "string" ? { message } : message;
    await fetch("/api/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error("ログ送信に失敗:", error);
  }
}
