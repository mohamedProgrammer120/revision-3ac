"use client";

import { useState, useEffect, useCallback } from "react";
import { SUBJECTS } from "@/lib/subjects";
import { db } from "@/lib/db";
import QuestionCard from "@/components/quiz/QuestionCard";
import { Timer, Play, Loader2, Flag } from "lucide-react";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export default function ExamenPage() {
  const [subject, setSubject] = useState("maths");
  const [lesson, setLesson] = useState("");
  const [minutes, setMinutes] = useState(15);
  const [count, setCount] = useState(10);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const finish = useCallback(async () => {
    if (finished) return;
    setFinished(true);
    setStarted(false);
    const score = questions.reduce(
      (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
      0
    );
    await db.attempts.add({
      subject,
      questions: questions.map((q) => ({
        q: q.question,
        options: q.options,
        correct: q.correctIndex,
      })),
      answers: answers.map((a) => (a === undefined ? -1 : a)),
      score,
      total: questions.length,
      createdAt: Date.now(),
    });
  }, [finished, questions, answers, subject]);

  useEffect(() => {
    if (!started || finished) return;
    if (secondsLeft <= 0) {
      finish();
      return;
    }
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [started, secondsLeft, finished, finish]);

  async function start() {
    setError(null);
    setLoading(true);
    setFinished(false);
    setAnswers([]);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur");
      setQuestions(data.questions);
      setAnswers(new Array(data.questions.length).fill(undefined));
      setSecondsLeft(minutes * 60);
      setStarted(true);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  const mm = Math.floor(secondsLeft / 60);
  const ss = secondsLeft % 60;
  const score = questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correctIndex ? 1 : 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Timer className="text-orange-400" /> Examen blanc
        </h1>
        <p className="text-slate-400 mt-1">
          QCM chronométré — comme un vrai contrôle
        </p>
      </header>

      {!started && !finished && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-orange-500"
            >
              {SUBJECTS.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="bg-slate-800 rounded-xl p-3 outline-none"
            >
              {[5, 10, 15, 20].map((n) => (
                <option key={n} value={n}>
                  {n} questions
                </option>
              ))}
            </select>
            <select
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="bg-slate-800 rounded-xl p-3 outline-none"
            >
              {[5, 10, 15, 20, 30].map((n) => (
                <option key={n} value={n}>
                  {n} min
                </option>
              ))}
            </select>
          </div>
          <textarea
            value={lesson}
            onChange={(e) => setLesson(e.target.value)}
            placeholder="Colle le cours / leçon pour générer l'examen (min 50 caractères)..."
            className="w-full h-48 p-4 rounded-xl bg-slate-800 resize-none outline-none focus:ring-2 focus:ring-orange-500"
          />
          {error && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={start}
            disabled={loading || lesson.length < 50}
            className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-orange-500 to-red-500 hover:opacity-90 disabled:opacity-40 rounded-xl font-bold text-lg transition"
          >
            {loading ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Play size={20} />
            )}
            {loading ? "Génération..." : "Démarrer l'examen"}
          </button>
        </div>
      )}

      {started && (
        <div className="sticky top-14 z-20 flex items-center justify-between p-4 bg-slate-900/95 border border-orange-500/40 rounded-xl backdrop-blur">
          <span className="font-mono text-2xl text-orange-300">
            {String(mm).padStart(2, "0")}:{String(ss).padStart(2, "0")}
          </span>
          <button
            type="button"
            onClick={finish}
            className="flex items-center gap-2 px-4 py-2 bg-orange-500 hover:bg-orange-400 rounded-xl font-semibold transition"
          >
            <Flag size={16} /> Terminer
          </button>
        </div>
      )}

      {started &&
        questions.map((q, i) => (
          <QuestionCard
            key={i}
            index={i}
            question={q}
            selected={answers[i]}
            onSelect={(j) => {
              if (finished) return;
              const copy = [...answers];
              copy[i] = j;
              setAnswers(copy);
            }}
          />
        ))}

      {finished && (
        <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/40 rounded-2xl p-8 text-center space-y-4">
          <p className="text-5xl font-bold">
            {score} / {questions.length}
          </p>
          <p className="text-slate-300">
            {Math.round((score / Math.max(questions.length, 1)) * 100)}% — Examen
            terminé
          </p>
          <button
            type="button"
            onClick={() => {
              setQuestions([]);
              setAnswers([]);
              setFinished(false);
              setStarted(false);
              setLesson("");
            }}
            className="px-6 py-3 bg-orange-500 hover:bg-orange-400 rounded-xl font-semibold transition"
          >
            Nouvel examen
          </button>
        </div>
      )}
    </div>
  );
}
