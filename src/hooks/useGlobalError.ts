import { useEffect, useState } from "react";

// イベントハンドラ内や非同期関数内でthrowされたエラーはErrorBoundaryでキャッチできないので、
// グローバルなエラー状態を持つカスタムフックを作成する
export function useGlobalError() {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (error) {
      throw error;
    }
  }, [error]);

  return { error, setError };
}
