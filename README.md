## Server Action におけるエラーハンドリング

- server action 内の例外エラーは全て throw する（action の失敗のケースも想定してどちらにしろクライアント側では try catch 処理が必須なのでそれ以外の例外エラーもそちらにまとめたい）
- クライアントから server action を呼ぶ場合、try catch で例外エラーを useGlobalError でセットする
- error.tsx で CustomError を解釈してエラーの表示分けを行う

## 環境変数

```
SUPABASE_URL=**********
SUPABASE_ANON_KEY=**********
LINE_CHANNEL_ID=**********
NEXT_PUBLIC_HOST=**********
NEXT_PUBLIC_LIFF_ID=**********
NEXT_PUBLIC_LIFF_MOCK_MODE=****
```
