"use client";

import { useState } from "react";
import { db } from "@/lib/db";
import { SUBJECTS } from "@/lib/subjects";
import QuestionCard from "@/components/quiz/QuestionCard";
import QuizResult from "@/components/quiz/QuizResult";
import { Zap, Loader2 } from "lucide-react";

type Question = {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export default function QuizPage() {
  const [lesson, setLesson] = useState("");
  const [subject, setSubject] = useState("maths");
  const [count, setCount] = useState(5);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<(number | undefined)[]>([]);
  const [loading, setLoading] = useState(false);
  const [finished, setFinished] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setLoading(true);
    setQuestions([]);
    setAnswers([]);
    setFinished(false);
    setError(null);
    try {
      const res = await fetch("/api/quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lesson, count }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur de génération");
      if (data.questions) {
        setQuestions(data.questions);
        setAnswers(new Array(data.questions.length).fill(undefined));
      }
    } catch (e: any) {
      setError(e.message || "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  }

  async function finish() {
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
      answers: answers as number[],
      score,
      total: questions.length,
      createdAt: Date.now(),
    });
    setFinished(true);
  }

  const allAnswered =
    questions.length > 0 &&
    answers.every((a) => a !== undefined);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Zap className="text-cyan-400" /> Quiz IA
        </h1>
        <p className="text-slate-400 mt-1">
          Colle ta leçon → Gemini génère un QCM instantané.
        </p>
      </header>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <select
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="bg-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500"
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
            className="bg-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {[5, 10, 15, 20].map((n) => (
              <option key={n} value={n}>
                {n} questions
              </option>
            ))}
          </select>
          <button
            onClick={generate}
            disabled={loading || lesson.length < 50}
            className="bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed rounded-xl px-4 py-3 font-semibold flex items-center justify-center gap-2 transition"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <Zap size={18} />
            )}
            {loading ? "Génération..." : "Générer"}
          </button>
        </div>

        <textarea
          value={lesson}
          onChange={(e) => setLesson(e.target.value)}
          placeholder="Colle ta leçon ici (min 50 caractères)..."
          className="w-full h-64 p-4 rounded-xl bg-slate-800 resize-none focus:ring-2 focus:ring-cyan-500 outline-none"
        />
        <p className="text-xs text-slate-500 text-right">{lesson.length} caractères</p>

        {error && (
          <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/30 rounded-lg p-3">
            {error}
          </p>
        )}
      </div>

      {questions.map((q, i) => (
        <QuestionCard
          key={i}
          index={i}
          question={q}
          selected={answers[i]}
          onSelect={(j) => {
            const copy = [...answers];
            copy[i] = j;
            setAnswers(copy);
          }}
        />
      ))}

      {allAnswered && !finished && (
        <button
          onClick={finish}
          className="w-full bg-gradient-to-r from-cyan-500 to-purple-500 hover:opacity-90 rounded-xl py-4 font-bold text-lg transition"
        >
          ✅ Terminer et enregistrer
        </button>
      )}

      {finished && (
        <QuizResult
          questions={questions}
          answers={answers as number[]}
          onRestart={() => {
            setQuestions([]);
            setAnswers([]);
            setFinished(false);
            setLesson("");
          }}
        />
      )}
    </div>
  );
}
