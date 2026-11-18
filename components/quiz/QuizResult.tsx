interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function QuizResult({
  questions,
  answers,
  onRestart,
}: {
  questions: Question[];
  answers: number[];
  onRestart: () => void;
}) {
  const score = questions.reduce(
    (a, q, i) => a + (answers[i] === q.correctIndex ? 1 : 0),
    0
  );
  const pct = Math.round((score / questions.length) * 100);
  const emoji = pct >= 80 ? "🏆" : pct >= 50 ? "👍" : "💪";

  return (
    <div className="bg-gradient-to-br from-cyan-500/20 to-purple-500/20 border border-cyan-500/40 rounded-2xl p-8 text-center">
      <div className="text-6xl mb-4">{emoji}</div>
      <p className="text-4xl font-bold">
        {score} / {questions.length}
      </p>
      <p className="text-slate-300 mt-2">{pct}% de réussite</p>
      <button
        onClick={onRestart}
        className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 rounded-xl font-semibold transition"
      >
        🔁 Recommencer
      </button>
    </div>
  );
}
