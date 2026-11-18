"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { db, Lesson } from "@/lib/db";
import { SUBJECTS } from "@/lib/subjects";
import Link from "next/link";
import MindMap, { type MindNode } from "@/components/mindmap/MindMap";
import {
  ArrowLeft,
  Sparkles,
  Layers,
  CheckCircle2,
  Loader2,
  Zap,
  Network,
  Save,
  Maximize2,
  X,
  RefreshCw,
} from "lucide-react";

export default function LeconPage() {
  const params = useParams();
  const slug = params.slug as string;
  const id = Number(params.id);
  const subject = SUBJECTS.find((s) => s.slug === slug);

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [loadingCards, setLoadingCards] = useState(false);
  const [loadingMindmap, setLoadingMindmap] = useState(false);
  const [mindmap, setMindmap] = useState<MindNode | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [savingMap, setSavingMap] = useState(false);

  useEffect(() => {
    db.lessons.get(id).then((l) => {
      if (l) setLesson(l);
    });
  }, [id]);

  if (!lesson || !subject) {
    return (
      <div className="text-center py-20">
        <p className="text-slate-400">Chargement...</p>
      </div>
    );
  }

  const current = lesson;
  const isArabicSubject = ["histoire", "arabe", "islamique"].includes(slug);
  const backHref = "/matieres/" + slug;

  async function generateSummary() {
    setLoadingSummary(true);
    setMessage(null);
    try {
      const res = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: current.content }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      await db.lessons.update(id, {
        summary: data.summary,
        updatedAt: Date.now(),
      });
      setLesson((prev) => (prev ? { ...prev, summary: data.summary } : prev));
      setMessage("Résumé généré");
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoadingSummary(false);
    }
  }

  async function generateFlashcards() {
    setLoadingCards(true);
    setMessage(null);
    try {
      const res = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: current.content, subject: slug }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const now = Date.now();
      for (const card of data.cards) {
        await db.flashcards.add({
          subject: slug,
          front: card.front,
          back: card.back,
          ease: 2.5,
          interval: 0,
          repetitions: 0,
          dueDate: now,
          createdAt: now,
        });
      }
      setMessage(String(data.cards.length) + " flashcards créées");
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoadingCards(false);
    }
  }

  async function generateMindmap() {
    setLoadingMindmap(true);
    setMessage(null);
    setMindmap(null);
    try {
      const res = await fetch("/api/mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: current.content,
          title: current.title,
          subject: slug,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setMindmap(data);
      setMessage(
        isArabicSubject
          ? "تم إنشاء الخطاطة الذهنية"
          : "Carte mentale générée"
      );
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : "Erreur");
    } finally {
      setLoadingMindmap(false);
    }
  }

  async function saveMindmap() {
    if (!mindmap) return;
    setSavingMap(true);
    try {
      await db.mindmaps.add({
        lessonId: id,
        subject: slug,
        title: mindmap.title || current.title,
        data: mindmap,
        createdAt: Date.now(),
      });
      setMessage(
        isArabicSubject ? "تم حفظ الخطاطة" : "Carte sauvegardée"
      );
    } catch (e: unknown) {
      setMessage(e instanceof Error ? e.message : "Erreur sauvegarde");
    } finally {
      setSavingMap(false);
    }
  }

  async function toggleMastered() {
    const newVal = !current.mastered;
    await db.lessons.update(id, { mastered: newVal, updatedAt: Date.now() });
    setLesson((prev) => (prev ? { ...prev, mastered: newVal } : prev));
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href={backHref}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400"
        >
          <ArrowLeft size={20} />
        </Link>
        <span className="text-sm text-slate-500">
          {subject.icon} {subject.name}
        </span>
      </div>

      <div className="flex items-start justify-between gap-4">
        <h1 className="text-3xl font-bold">{current.title}</h1>
        <button
          type="button"
          onClick={toggleMastered}
          className={
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition shrink-0 " +
            (current.mastered
              ? "bg-green-500/20 text-green-400 border border-green-500/40"
              : "bg-slate-800 text-slate-300 hover:bg-slate-700")
          }
        >
          <CheckCircle2 size={16} />
          {current.mastered ? "Maîtrisé" : "Marquer maîtrisé"}
        </button>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={generateSummary}
          disabled={loadingSummary}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 rounded-xl text-sm font-medium transition disabled:opacity-50"
        >
          {loadingSummary ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Sparkles size={16} />
          )}
          Résumer IA
        </button>

        <button
          type="button"
          onClick={generateFlashcards}
          disabled={loadingCards}
          className="flex items-center gap-2 px-4 py-2.5 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 rounded-xl text-sm font-medium transition disabled:opacity-50"
        >
          {loadingCards ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Layers size={16} />
          )}
          Flashcards
        </button>

        <button
          type="button"
          onClick={generateMindmap}
          disabled={loadingMindmap}
          className="flex items-center gap-2 px-4 py-2.5 bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 rounded-xl text-sm font-medium transition disabled:opacity-50"
        >
          {loadingMindmap ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Network size={16} />
          )}
          {isArabicSubject ? "خطاطة ذهنية" : "Carte mentale"}
        </button>

        <Link
          href="/quiz"
          className="flex items-center gap-2 px-4 py-2.5 bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-300 border border-yellow-500/40 rounded-xl text-sm font-medium transition"
        >
          <Zap size={16} />
          Quiz
        </Link>
      </div>

      {message && (
        <p className="text-sm p-3 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          {message}
        </p>
      )}

      {mindmap && (
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="font-semibold text-pink-300 flex items-center gap-2">
              <Network size={18} />{" "}
              {isArabicSubject ? "الخطاطة الذهنية" : "Carte mentale"}
            </h2>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={generateMindmap}
                disabled={loadingMindmap}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              >
                <RefreshCw size={12} /> Régénérer
              </button>
              <button
                type="button"
                onClick={saveMindmap}
                disabled={savingMap}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/30 rounded-lg transition"
              >
                <Save size={12} />{" "}
                {savingMap ? "..." : isArabicSubject ? "حفظ" : "Sauvegarder"}
              </button>
              <button
                type="button"
                onClick={() => setFullscreen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs bg-slate-800 hover:bg-slate-700 rounded-lg transition"
              >
                <Maximize2 size={12} /> Plein écran
              </button>
            </div>
          </div>
          <div dir={isArabicSubject ? "rtl" : "ltr"}>
            <MindMap data={mindmap} expandAll />
          </div>
        </div>
      )}

      {current.summary && (
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-2xl p-6">
          <h2 className="font-semibold text-purple-300 mb-3 flex items-center gap-2">
            <Sparkles size={18} /> Résumé IA
          </h2>
          <p className="text-slate-200 whitespace-pre-wrap leading-relaxed">
            {current.summary}
          </p>
        </div>
      )}

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="font-semibold mb-4 text-slate-300">Contenu de la leçon</h2>
        <div className="text-slate-300 whitespace-pre-wrap leading-relaxed">
          {current.content}
        </div>
      </div>

      {fullscreen && mindmap && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur flex flex-col">
          <div className="flex items-center justify-between p-4 border-b border-slate-800">
            <h2 className="font-bold text-xl">{mindmap.title}</h2>
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
            dir={isArabicSubject ? "rtl" : "ltr"}
          >
            <MindMap data={mindmap} expandAll />
          </div>
        </div>
      )}
    </div>
  );
}
