import { Target, Trophy, BookOpen, Layers } from "lucide-react";

export default function StatsOverview({
  averageScore,
  totalAttempts,
  totalLessons,
  dueCards,
}: {
  averageScore: number;
  totalAttempts: number;
  totalLessons: number;
  dueCards: number;
}) {
  const stats = [
    { label: "Moyenne", value: `${averageScore}%`, icon: Target, color: "text-cyan-400" },
    { label: "Quiz faits", value: totalAttempts, icon: Trophy, color: "text-yellow-400" },
    { label: "Leçons", value: totalLessons, icon: BookOpen, color: "text-green-400" },
    { label: "À réviser", value: dueCards, icon: Layers, color: "text-pink-400" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
        >
          <s.icon size={24} className={s.color} />
          <p className="text-2xl font-bold mt-3">{s.value}</p>
          <p className="text-sm text-slate-400">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
