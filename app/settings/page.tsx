"use client";

import { useState } from "react";
import { db } from "@/lib/db";
import { seedSampleData } from "@/lib/seed";
import { Download, Upload, Trash2, Database, AlertTriangle } from "lucide-react";

export default function SettingsPage() {
  const [msg, setMsg] = useState<string | null>(null);

  async function exportData() {
    const [lessons, flashcards, attempts, mindmaps] = await Promise.all([
      db.lessons.toArray(),
      db.flashcards.toArray(),
      db.attempts.toArray(),
      db.mindmaps.toArray(),
    ]);
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      lessons,
      flashcards,
      attempts,
      mindmaps,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "hub-3ac-backup-" + Date.now() + ".json";
    a.click();
    URL.revokeObjectURL(url);
    setMsg("Export téléchargé ✓");
  }

  async function importData(file: File) {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      if (data.lessons?.length) await db.lessons.bulkPut(data.lessons);
      if (data.flashcards?.length) await db.flashcards.bulkPut(data.flashcards);
      if (data.attempts?.length) await db.attempts.bulkPut(data.attempts);
      if (data.mindmaps?.length) await db.mindmaps.bulkPut(data.mindmaps);
      setMsg("Import réussi ✓ — recharge la page");
    } catch {
      setMsg("Fichier invalide");
    }
  }

  async function clearAll() {
    if (!confirm("Supprimer TOUTES les données locales ? Irréversible.")) return;
    await Promise.all([
      db.lessons.clear(),
      db.flashcards.clear(),
      db.attempts.clear(),
      db.mindmaps.clear(),
    ]);
    setMsg("Données effacées");
  }

  async function seed() {
    const r = await seedSampleData();
    setMsg(r.message);
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">⚙️ Paramètres</h1>

      {msg && (
        <p className="text-sm p-3 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          {msg}
        </p>
      )}

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2">
          <Database size={18} /> Données
        </h2>
        <p className="text-sm text-slate-400">
          Tout est stocké localement (IndexedDB). Exporte pour sauvegarder.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            onClick={exportData}
            className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 rounded-xl text-sm font-medium hover:bg-cyan-500/30 transition"
          >
            <Download size={16} /> Exporter JSON
          </button>
          <label className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium cursor-pointer transition">
            <Upload size={16} /> Importer JSON
            <input
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) importData(f);
              }}
            />
          </label>
          <button
            type="button"
            onClick={seed}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-medium transition"
          >
            <Database size={16} /> Données d&apos;exemple
          </button>
        </div>
      </section>

      <section className="bg-slate-900 border border-red-900/50 rounded-2xl p-6 space-y-4">
        <h2 className="font-semibold flex items-center gap-2 text-red-400">
          <AlertTriangle size={18} /> Zone danger
        </h2>
        <button
          type="button"
          onClick={clearAll}
          className="flex items-center gap-2 px-4 py-2.5 bg-red-500/20 text-red-300 border border-red-500/40 rounded-xl text-sm font-medium hover:bg-red-500/30 transition"
        >
          <Trash2 size={16} /> Tout supprimer
        </button>
      </section>

      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-sm text-slate-400 space-y-2">
        <p>
          <strong className="text-slate-200">GEMINI_API_KEY</strong> doit être
          définie dans Vercel → Settings → Environment Variables.
        </p>
        <p>
          Sans clé API, les quiz / résumés / flashcards / PDF / photos / mind
          maps ne fonctionnent pas.
        </p>
      </section>
    </div>
  );
}
