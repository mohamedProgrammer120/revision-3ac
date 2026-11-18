"use client";

import { useState } from "react";
import { seedSampleData } from "@/lib/seed";
import { Database } from "lucide-react";

export default function SeedButton() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function handleSeed() {
    setLoading(true);
    setMsg(null);
    try {
      const result = await seedSampleData();
      setMsg(result.message);
    } catch (e: any) {
      setMsg(e.message || "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button
        onClick={handleSeed}
        disabled={loading}
        className="flex items-center gap-2 px-4 py-2 text-sm bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition disabled:opacity-50"
      >
        <Database size={16} />
        {loading ? "Chargement..." : "Charger données d'exemple"}
      </button>
      {msg && <span className="text-xs text-slate-400">{msg}</span>}
    </div>
  );
}
