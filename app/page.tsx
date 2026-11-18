"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { SUBJECTS } from "@/lib/subjects";
import SubjectCard from "@/components/dashboard/SubjectCard";
import StatsOverview from "@/components/dashboard/StatsOverview";
import UpcomingReviews from "@/components/dashboard/UpcomingReviews";
import SeedButton from "@/components/dashboard/SeedButton";
import Link from "next/link";
import { Zap, Timer, Layers, Network, BookOpen } from "lucide-react";

export default function Dashboard() {
  const attempts = useLiveQuery(() => db.attempts.toArray(), []) ?? [];
  const lessons = useLiveQuery(() => db.lessons.toArray(), []) ?? [];
  const cards = useLiveQuery(() => db.flashcards.toArray(), []) ?? [];

  const totalScore = attempts.reduce((a, t) => a + t.score, 0);
  const totalQ = attempts.reduce((a, t) => a + t.total, 0);
  const avg = totalQ ? Math.round((totalScore / totalQ) * 100) : 0;
  const dueToday = cards.filter((c) => c.dueDate <= Date.now()).length;

  function progressFor(slug: string) {
    const subjectLessons = lessons.filter((l) => l.subject === slug);
    if (!subjectLessons.length) return 0;
    return Math.round(
      (subjectLessons.filter((l) => l.mastered).length / subjectLessons.length) *
        100
    );
  }

  const shortcuts = [
    {
      href: "/quiz",
      label: "Quiz IA",
      desc: "QCM depuis une leçon",
      icon: Zap,
      color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/30",
    },
    {
      href: "/examen",
      label: "Examen blanc",
      desc: "Timer + conditions réelles",
      icon: Timer,
      color: "text-orange-400 bg-orange-500/10 border-orange-500/30",
    },
    {
      href: "/flashcards",
      label: "Flashcards",
      desc: dueToday + " à réviser",
      icon: Layers,
      color: "text-pink-400 bg-pink-500/10 border-pink-500/30",
    },
    {
      href: "/mindmaps",
      label: "خطاطات",
      desc: "Cartes mentales IA",
      icon: Network,
      color: "text-purple-400 bg-purple-500/10 border-purple-500/30",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bonjour 👋</h1>
          <p className="text-slate-400 mt-1">
            {dueToday > 0
              ? dueToday + " carte(s) à réviser aujourd'hui"
              : "Prêt à réviser — choisis une matière ci-dessous"}
          </p>
        </div>
        {lessons.length === 0 && <SeedButton />}
      </div>

      <StatsOverview
        averageScore={avg}
        totalAttempts={attempts.length}
        totalLessons={lessons.length}
        dueCards={dueToday}
      />

      {/* Raccourcis fonctionnalités */}
      <section>
        <h2 className="text-xl font-semibold mb-4">⚡ Accès rapide</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {shortcuts.map((s) => (
            <Link
              key={s.href}
              href={s.href}
              className={
                "p-4 rounded-2xl border transition hover:scale-[1.02] " + s.color
              }
            >
              <s.icon size={22} className="mb-2" />
              <p className="font-semibold text-sm">{s.label}</p>
              <p className="text-xs opacity-70 mt-0.5">{s.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <BookOpen size={20} /> Mes matières
        </h2>
        <p className="text-sm text-slate-500 mb-4">
          Clique une matière → ajoute des leçons (texte, PDF, photo) → génère
          quiz, flashcards, خطاطات
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUBJECTS.map((s) => (
            <SubjectCard key={s.slug} {...s} progress={progressFor(s.slug)} />
          ))}
        </div>
      </section>

      <UpcomingReviews />
    </div>
  );
}
