import { PlayerType } from "@/types/playerTypes";
import { QuizType } from "@/types/quizTypes";
import { cn } from "@/utils/cn";
import { LuCrown } from "react-icons/lu";

export const AdminResultContainer: React.FC<{
  quiz: QuizType;
  sortedPlayers: PlayerType[];
}> = ({ quiz, sortedPlayers }) => {
  return (
    <main className="min-h-screen p-8 pb-20">
      <div className="p-1">
        <h1 className="text-xl font-bold tracking-wider text-neutral-700 text-center">
          {quiz.title}
        </h1>
        <h2 className="text-3xl font-bold tracking-wider text-neutral-700 flex justify-center gap-2 mt-4">
          <LuCrown size={32} /> 回答者ランキング
        </h2>
      </div>
      <p className="tracking-wider text-neutral-700 text-center mt-6">
        参加者数
        <span className="px-2 font-semibold text-xl">
          {sortedPlayers.length}
        </span>
      </p>
      <div className="flex justify-center mt-6">
        <ul>
          {sortedPlayers.map((player, i) => (
            <li
              key={player.id}
              className="grid grid-cols-3 gap-2 justify-center items-end text-neutral-700 mt-8"
            >
              <p className="text-2xl pb-4">{player.name}</p>
              <p className="text-center px-10 relative">
                <span
                  className={`font-semibold ${cn("text-5xl", {
                    "text-8xl text-emerald-600": i < 3,
                    "text-7xl text-teal-700": i < 8 && i >= 3,
                  })}`}
                >
                  {player.earned_points}
                </span>
                <span className="absolute text-2xl bottom-4 right-0">点</span>
              </p>
              <div></div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
};
