"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db";
import { SUBJECTS } from "@/lib/subjects";
import Link from "next/link";
import ImportLessonForm from "@/components/lessons/ImportLessonForm";
import {
  Plus,
  BookOpen,
  CheckCircle2,
  Circle,
  Trash2,
  Sparkles,
} from "lucide-react";

export default function MatierePage() {
  const params = useParams();
  const slug = params.slug as string;
  const subject = SUBJECTS.find((s) => s.slug === slug);

  const lessons =
    useLiveQuery(
      () =>
        db.lessons.where("subject").equals(slug).reverse().sortBy("updatedAt"),
      [slug]
    ) ?? [];

  const [showForm, setShowForm] = useState(false);

  if (!subject) {
    return (
      <div className="text-center py-20">
        <p className="text-xl">Matière introuvable</p>
        <Link href="/" className="text-cyan-400 mt-4 inline-block">
          ← Retour au dashboard
        </Link>
      </div>
    );
  }

  async function handleSave(title: string, content: string) {
    await db.lessons.add({
      subject: slug,
      title,
      content,
      mastered: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    setShowForm(false);
  }

  async function toggleMastered(id: number, current: boolean) {
    await db.lessons.update(id, {
      mastered: !current,
      updatedAt: Date.now(),
    });
  }

  async function deleteLesson(id: number) {
    if (!confirm("Supprimer cette leçon ?")) return;
    await db.lessons.delete(id);
  }

  const masteredCount = lessons.filter((l) => l.mastered).length;
  const progress = lessons.length
    ? Math.round((masteredCount / lessons.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <span className="text-5xl">{subject.icon}</span>
          <div>
            <h1 className="text-3xl font-bold">{subject.name}</h1>
            <p className="text-slate-400">
              {lessons.length} leçon(s) · {progress}% maîtrisé
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-5 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold transition"
        >
          <Plus size={18} />
          Nouvelle leçon
        </button>
      </div>

      {/* Progress bar */}
      <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{ width: `${progress}%`, background: subject.color }}
        />
      </div>

      {/* Import form with multiple methods */}
      {showForm && (
        <ImportLessonForm
          subject={slug}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
        />
      )}

      {/* Lessons list */}
      {lessons.length === 0 ? (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-2xl">
          <BookOpen size={48} className="mx-auto text-slate-600 mb-4" />
          <p className="text-lg font-medium">Aucune leçon pour l'instant</p>
          <p className="text-slate-400 mt-1 text-sm">
            Colle du texte, importe un fichier, ou prends une photo de ton cahier
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {lessons.map((lesson) => (
            <div
              key={lesson.id}
              className="group flex items-center gap-4 p-4 bg-slate-900 border border-slate-800 rounded-xl hover:border-slate-600 transition"
            >
              <button
                onClick={() => toggleMastered(lesson.id!, lesson.mastered)}
                className="shrink-0"
                title={
                  lesson.mastered ? "Marquer non maîtrisé" : "Marquer maîtrisé"
                }
              >
                {lesson.mastered ? (
                  <CheckCircle2 className="text-green-400" size={22} />
                ) : (
                  <Circle className="text-slate-600" size={22} />
                )}
              </button>

              <Link
                href={`/matieres/${slug}/lecon/${lesson.id}`}
                className="flex-1 min-w-0"
              >
                <h3 className="font-medium truncate group-hover:text-cyan-300 transition">
                  {lesson.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {new Date(lesson.updatedAt).toLocaleDateString("fr-FR")}
                  {lesson.summary ? " · Résumé IA disponible" : ""}
                </p>
              </Link>

              <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition">
                <Link
                  href={`/matieres/${slug}/lecon/${lesson.id}`}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-cyan-400"
                  title="Ouvrir"
                >
                  <Sparkles size={16} />
                </Link>
                <button
                  onClick={() => deleteLesson(lesson.id!)}
                  className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-red-400"
                  title="Supprimer"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
