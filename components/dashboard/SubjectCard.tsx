import Link from "next/link";

interface Props {
  slug: string;
  name: string;
  icon: string;
  color: string;
  chapters: number;
  progress: number;
}

export default function SubjectCard({
  slug,
  name,
  icon,
  color,
  chapters,
  progress,
}: Props) {
  return (
    <Link
      href={`/matieres/${slug}`}
      className="group relative block rounded-2xl p-5 bg-slate-900 border border-slate-800
                 hover:border-slate-600 hover:scale-[1.02] transition-all overflow-hidden"
    >
      <div
        className="absolute inset-0 opacity-10 group-hover:opacity-20 transition"
        style={{
          background: `radial-gradient(circle at top right, ${color}, transparent 70%)`,
        }}
      />
      <div className="relative">
        <div className="text-4xl mb-3">{icon}</div>
        <h3 className="font-semibold">{name}</h3>
        <p className="text-xs text-slate-400 mb-3">{chapters} chapitres</p>

        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all"
            style={{ width: `${progress}%`, background: color }}
          />
        </div>
        <p className="text-xs text-slate-400 mt-2">{progress}% maîtrisé</p>
      </div>
    </Link>
  );
}
