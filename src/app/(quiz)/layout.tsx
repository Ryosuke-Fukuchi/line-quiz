import { LiffProvider } from "@/components/provider/LiffProvider";
import { PlayerProvider } from "@/components/provider/PlayerProvider";

export default function TestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LiffProvider>
      <PlayerProvider>{children}</PlayerProvider>
    </LiffProvider>
  );
}
