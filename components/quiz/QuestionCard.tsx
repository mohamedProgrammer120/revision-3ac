interface Question {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export default function QuestionCard({
  index,
  question,
  selected,
  onSelect,
}: {
  index: number;
  question: Question;
  selected: number | undefined;
  onSelect: (j: number) => void;
}) {
  const revealed = selected !== undefined;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
      <p className="font-semibold mb-4">
        <span className="text-cyan-400 mr-2">Q{index + 1}.</span>
        {question.question}
      </p>
      <div className="space-y-2">
        {question.options.map((opt, j) => {
          const correct = question.correctIndex === j;
          const chosen = selected === j;
          let cls = "bg-slate-800 hover:bg-slate-700";
          if (revealed && correct) cls = "bg-green-600/80";
          else if (revealed && chosen) cls = "bg-red-600/80";

          return (
            <button
              key={j}
              onClick={() => onSelect(j)}
              disabled={revealed}
              className={`w-full text-left p-3 rounded-xl transition ${cls}`}
            >
              <span className="font-mono text-slate-400 mr-2">
                {String.fromCharCode(65 + j)}.
              </span>
              {opt}
            </button>
          );
        })}
      </div>
      {revealed && (
        <p className="text-sm mt-4 p-3 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
          💡 {question.explanation}
        </p>
      )}
    </div>
  );
}
