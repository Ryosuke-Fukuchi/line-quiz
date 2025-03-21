"use client";

export default function GlobalError({
  error,
}: {
  error: Error;
  reset: () => void;
}) {
  let title = "エラーが発生しました";
  let message = "もう一度やり直してください";
  try {
    const { message: m, statusCode } = JSON.parse(error.message);
    switch (statusCode) {
      case 401:
        title = "401";
        message = "認証エラーが発生しました";
        break;
      case 403:
        title = "403";
        message = "操作を行う権限がありません";
        break;
      case 500:
        title = "500";
        message = "サーバーエラーが発生しました";
        break;
      default:
        title = `${statusCode}`;
        message = m;
        break;
    }
  } catch {}
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-200 text-gray-900">
      <div className="text-center bg-gray-300/50 p-8 rounded-lg">
        <h1 className="text-lg font-semibold">{title}</h1>
        <div className="w-full border-t border-gray-600 mt-3"></div>
        <p className="mt-3 text-sm">{message}</p>
      </div>
    </div>
  );
}
