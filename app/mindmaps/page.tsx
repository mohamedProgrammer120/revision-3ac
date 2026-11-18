"use client";

import { useState } from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { db, SavedMindMap } from "@/lib/db";
import { SUBJECTS } from "@/lib/subjects";
import MindMap from "@/components/mindmap/MindMap";
import { Network, Trash2, Maximize2, X } from "lucide-react";
import Link from "next/link";

export default function MindMapsPage() {
  const maps =
    useLiveQuery(
      () => db.mindmaps.orderBy("createdAt").reverse().toArray(),
      []
    ) ?? [];

  const [selected, setSelected] = useState<SavedMindMap | null>(null);
  const [fullscreen, setFullscreen] = useState(false);

  async function remove(id: number) {
    if (!confirm("Supprimer cette carte mentale ?")) return;
    await db.mindmaps.delete(id);
    if (selected?.id === id) setSelected(null);
  }

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Network className="text-pink-400" /> خطاطات ذهنية / Cartes mentales
        </h1>
        <p className="text-slate-400 mt-1">
          Toutes tes cartes sauvegardées. Génère-en depuis une leçon.
        </p>
      </header>

      {maps.length === 0 ? (
        <div className="text-center py-20 bg-slate-900 border border-slate-800 rounded-2xl">
          <Network size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-lg font-medium">Aucune carte mentale</p>
          <p className="text-slate-400 text-sm mt-2">
            Ouvre une leçon → clique sur « خطاطة ذهنية » / « Carte mentale »
          </p>
          <Link
            href="/"
            className="inline-block mt-6 px-5 py-2.5 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold transition"
          >
            Aller au dashboard
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List */}
          <div className="space-y-2 lg:col-span-1">
            {maps.map((m) => {
              const subj = SUBJECTS.find((s) => s.slug === m.subject);
              const active = selected?.id === m.id;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelected(m)}
                  className={`w-full text-start p-4 rounded-xl border transition ${
                    active
                      ? "bg-pink-500/15 border-pink-500/40"
                      : "bg-slate-900 border-slate-800 hover:border-slate-600"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-medium truncate">{m.title}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {subj?.icon} {subj?.name} ·{" "}
                        {new Date(m.createdAt).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        remove(m.id!);
                      }}
                      className="p-1.5 text-slate-500 hover:text-red-400 shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Preview */}
          <div className="lg:col-span-2">
            {selected ? (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-lg">{selected.title}</h2>
                  <button
                    type="button"
                    onClick={() => setFullscreen(true)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                  >
                    <Maximize2 size={14} /> Plein écran
                  </button>
                </div>
                <div
                  dir={
                    ["histoire", "arabe", "islamique"].includes(selected.subject)
                      ? "rtl"
                      : "ltr"
                  }
                >
                  <MindMap data={selected.data} expandAll />
                </div>
              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-500 bg-slate-900 border border-slate-800 rounded-2xl">
                Sélectionne une carte pour l&apos;afficher
              </div>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen modal */}
      {fullscreen && selected && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <h2 className="font-bold text-xl">{selected.title}</h2>
            <button
              type="button"
              onClick={() => setFullscreen(false)}
              className="p-2 rounded-lg hover:bg-slate-800"
            >
              <X size={22} />
            </button>
          </div>
          <div
            className="flex-1 overflow-auto p-6"
            dir={
              ["histoire", "arabe", "islamique"].includes(selected.subject)
                ? "rtl"
                : "ltr"
            }
          >
            <MindMap data={selected.data} expandAll />
          </div>
        </div>
      )}
    </div>
  );
}
