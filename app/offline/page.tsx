"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <div className="text-7xl mb-6">📡</div>
      <h1 className="text-3xl font-bold mb-3">Tu es hors ligne</h1>
      <p className="text-slate-400 max-w-md mb-8">
        Pas de panique ! Tes leçons, flashcards et quiz déjà chargés restent
        disponibles. Reconnecte-toi pour générer de nouveaux contenus avec l'IA.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold transition"
      >
        Réessayer
      </button>
    </div>
  );
}
