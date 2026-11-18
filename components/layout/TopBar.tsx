"use client";

export default function TopBar() {
  return (
    <header className="h-14 border-b border-slate-800 bg-slate-900/30 backdrop-blur flex items-center justify-between px-4 md:px-8 sticky top-0 z-10">
      <div className="text-sm text-slate-400">
        Révisions intelligentes • 3AC
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
          Offline Ready
        </span>
      </div>
    </header>
  );
}
