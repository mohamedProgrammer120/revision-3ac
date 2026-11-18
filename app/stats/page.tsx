"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { SUBJECTS } from "@/lib/subjects";
import { BADGES } from "@/lib/gamification";
import { Flame, Award, Trophy, CheckCircle2 } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function StatsPage() {
  const attempts = useLiveQuery(() => db.attempts.toArray(), []) ?? [];
  const stats = useLiveQuery(() => db.userStats.toCollection().first());

  const data = SUBJECTS.map((s) => {
    const a = attempts.filter((x) => x.subject === s.slug);
    const score = a.reduce((acc, x) => acc + x.score, 0);
    const total = a.reduce((acc, x) => acc + x.total, 0);
    return {
      name: s.name.split(" ")[0],
      moyenne: total ? Math.round((score / total) * 100) : 0,
    };
  });

  const userBadges = stats?.badges || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <span>📊 Statistiques & Badges</span>
      </h1>

      {/* Gamification Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-orange-500/20 text-orange-400 rounded-xl">
            <Flame size={28} />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats?.streak || 1} jours</div>
            <div className="text-sm text-slate-400">Série d'apprentissage (Streak)</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl">
            <Award size={28} />
          </div>
          <div>
            <div className="text-2xl font-bold">{stats?.xp || 0} XP</div>
            <div className="text-sm text-slate-400">Points d'expérience</div>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex items-center gap-4">
          <div className="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
            <Trophy size={28} />
          </div>
          <div>
            <div className="text-2xl font-bold">
              {userBadges.length} / {BADGES.length}
            </div>
            <div className="text-sm text-slate-400">Badges débloqués</div>
          </div>
        </div>
      </div>

      {/* Badges Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
          <Trophy size={20} className="text-yellow-400" /> Trophées & Badges
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {BADGES.map((b) => {
            const unlocked = userBadges.includes(b.id);
            return (
              <div
                key={b.id}
                className={`p-4 rounded-xl border flex items-start gap-3 transition ${
                  unlocked
                    ? "bg-slate-800/80 border-cyan-500/40 text-slate-100"
                    : "bg-slate-900/40 border-slate-800 text-slate-500 opacity-60"
                }`}
              >
                <div
                  className={`p-2.5 rounded-lg shrink-0 ${
                    unlocked
                      ? "bg-cyan-500/20 text-cyan-400"
                      : "bg-slate-800 text-slate-600"
                  }`}
                >
                  <Trophy size={22} />
                </div>
                <div>
                  <div className="font-semibold flex items-center gap-2">
                    {b.title}
                    {unlocked && <CheckCircle2 size={16} className="text-cyan-400" />}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">{b.description}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 h-96">
        <h2 className="font-semibold mb-4">📈 Moyenne par matière (%)</h2>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" domain={[0, 100]} />
            <Tooltip
              contentStyle={{
                background: "#0f172a",
                border: "1px solid #334155",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="moyenne" fill="#06b6d4" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="font-semibold mb-4">📜 Historique récent</h2>
        <div className="space-y-2">
          {attempts.length === 0 && (
            <p className="text-slate-500">Aucun quiz encore.</p>
          )}
          {attempts
            .sort((a, b) => b.createdAt - a.createdAt)
            .slice(0, 10)
            .map((a) => (
              <div
                key={a.id}
                className="flex justify-between items-center p-3 bg-slate-800 rounded-lg text-sm"
              >
                <span>
                  {SUBJECTS.find((s) => s.slug === a.subject)?.name}
                </span>
                <span className="font-mono">
                  {a.score}/{a.total}
                </span>
                <span className="text-slate-400">
                  {new Date(a.createdAt).toLocaleDateString("fr-FR")}
                </span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
