"use client";

import { useState, useEffect } from "react";
import { db, Flashcard } from "@/lib/db";
import { getDueCards, reviewCard } from "@/lib/srs";
import { SUBJECTS } from "@/lib/subjects";
import FlashcardView from "@/components/flashcard/Flashcard";
import { Plus, X } from "lucide-react";

export default function FlashcardsPage() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [current, setCurrent] = useState(0);
  const [subject, setSubject] = useState<string>("all");
  const [showCreate, setShowCreate] = useState(false);
  const [front, setFront] = useState("");
  const [back, setBack] = useState("");
  const [createSubject, setCreateSubject] = useState("maths");

  useEffect(() => {
    load();
  }, [subject]);

  async function load() {
    const c = await getDueCards(subject === "all" ? undefined : subject);
    setCards(c);
    setCurrent(0);
  }

  async function handleReview(quality: number) {
    if (!cards[current]) return;
    await reviewCard(cards[current], quality);
    if (current + 1 < cards.length) {
      setCurrent((c) => c + 1);
    } else {
      load();
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;
    const now = Date.now();
    await db.flashcards.add({
      subject: createSubject,
      front: front.trim(),
      back: back.trim(),
      ease: 2.5,
      interval: 0,
      repetitions: 0,
      dueDate: now,
      createdAt: now,
    });
    setFront("");
    setBack("");
    setShowCreate(false);
    load();
  }

  const card = cards[current];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">🃏 Révision espacée</h1>
          <p className="text-slate-400 mt-1">
            {cards.length} carte(s) à réviser aujourd&apos;hui
          </p>
        </div>
        <button
          onClick={() => setShowCreate((v) => !v)}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold text-sm transition"
        >
          {showCreate ? <X size={16} /> : <Plus size={16} />}
          {showCreate ? "Fermer" : "Nouvelle carte"}
        </button>
      </header>

      {showCreate && (
        <form
          onSubmit={handleCreate}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4"
        >
          <select
            value={createSubject}
            onChange={(e) => setCreateSubject(e.target.value)}
            className="bg-slate-800 rounded-xl p-3 w-full outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {SUBJECTS.map((s) => (
              <option key={s.slug} value={s.slug}>
                {s.name}
              </option>
            ))}
          </select>
          <input
            value={front}
            onChange={(e) => setFront(e.target.value)}
            placeholder="Recto (question / terme)"
            className="w-full p-3 rounded-xl bg-slate-800 outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <textarea
            value={back}
            onChange={(e) => setBack(e.target.value)}
            placeholder="Verso (réponse)"
            className="w-full h-24 p-3 rounded-xl bg-slate-800 resize-none outline-none focus:ring-2 focus:ring-cyan-500"
            required
          />
          <button
            type="submit"
            className="px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold transition"
          >
            Créer la carte
          </button>
        </form>
      )}

      <select
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="bg-slate-800 rounded-xl p-3 outline-none focus:ring-2 focus:ring-cyan-500"
      >
        <option value="all">Toutes les matières</option>
        {SUBJECTS.map((s) => (
          <option key={s.slug} value={s.slug}>
            {s.name}
          </option>
        ))}
      </select>

      {card ? (
        <>
          <p className="text-sm text-slate-500 text-center">
            Carte {current + 1} / {cards.length} · {card.subject}
          </p>
          <FlashcardView card={card} />
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleReview(1)}
              className="py-3 rounded-xl bg-red-600 hover:bg-red-500 font-semibold transition"
            >
              ❌ Oublié
            </button>
            <button
              onClick={() => handleReview(3)}
              className="py-3 rounded-xl bg-yellow-600 hover:bg-yellow-500 font-semibold transition"
            >
              🤔 Difficile
            </button>
            <button
              onClick={() => handleReview(5)}
              className="py-3 rounded-xl bg-green-600 hover:bg-green-500 font-semibold transition"
            >
              ✅ Facile
            </button>
          </div>
        </>
      ) : (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <div className="text-6xl mb-4">🎉</div>
          <p className="text-xl font-semibold">Tout est révisé !</p>
          <p className="text-slate-400 mt-2">
            Crée de nouvelles cartes ou reviens demain.
          </p>
        </div>
      )}
    </div>
  );
}
