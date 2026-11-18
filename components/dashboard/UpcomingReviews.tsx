"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import Link from "next/link";

export default function UpcomingReviews() {
  const cards = useLiveQuery(() => db.flashcards.toArray(), []) ?? [];
  const due = cards.filter((c) => c.dueDate <= Date.now()).slice(0, 5);

  if (due.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">🃏 À réviser</h2>
        <Link
          href="/flashcards"
          className="text-sm text-cyan-400 hover:underline"
        >
          Voir tout →
        </Link>
      </div>
      <div className="space-y-2">
        {due.map((c) => (
          <div
            key={c.id}
            className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex justify-between items-center"
          >
            <span className="truncate">{c.front}</span>
            <span className="text-xs text-slate-500 ml-4 shrink-0">
              {c.subject}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
