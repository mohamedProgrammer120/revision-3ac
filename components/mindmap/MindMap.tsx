"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import type { MindNode } from "@/lib/db";

export type { MindNode };

const COLORS = [
  "from-cyan-500/40 to-cyan-600/10 border-cyan-400/50 text-cyan-100",
  "from-purple-500/40 to-purple-600/10 border-purple-400/50 text-purple-100",
  "from-emerald-500/40 to-emerald-600/10 border-emerald-400/50 text-emerald-100",
  "from-amber-500/40 to-amber-600/10 border-amber-400/50 text-amber-100",
  "from-pink-500/40 to-pink-600/10 border-pink-400/50 text-pink-100",
  "from-orange-500/40 to-orange-600/10 border-orange-400/50 text-orange-100",
  "from-sky-500/40 to-sky-600/10 border-sky-400/50 text-sky-100",
  "from-indigo-500/40 to-indigo-600/10 border-indigo-400/50 text-indigo-100",
];

function Node({
  node,
  depth = 0,
  colorIndex = 0,
  expandAll,
}: {
  node: MindNode;
  depth?: number;
  colorIndex?: number;
  expandAll?: boolean;
}) {
  const [open, setOpen] = useState(expandAll || depth < 2);
  const hasChildren = !!(node.children && node.children.length > 0);
  const color = COLORS[colorIndex % COLORS.length];

  if (depth === 0) {
    return (
      <div className="flex flex-col items-center gap-8 py-4">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/30 blur-xl rounded-full scale-150" />
          <div className="relative px-8 py-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-purple-600 text-white font-bold text-xl shadow-2xl shadow-cyan-500/30 border border-white/20">
            {node.title}
          </div>
        </div>

        {hasChildren && (
          <div className="flex flex-wrap justify-center gap-6 w-full">
            {node.children!.map((child, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 min-w-[160px] max-w-[260px] flex-1"
              >
                <div className="w-px h-6 bg-gradient-to-b from-slate-500 to-transparent" />
                <Node
                  node={child}
                  depth={1}
                  colorIndex={i}
                  expandAll={expandAll}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2 w-full">
      <button
        type="button"
        onClick={() => hasChildren && setOpen((o) => !o)}
        className={`w-full px-3.5 py-2.5 rounded-xl bg-gradient-to-br border text-sm font-medium text-start transition hover:scale-[1.03] hover:shadow-lg ${
          color
        } ${hasChildren ? "cursor-pointer" : "cursor-default"}`}
      >
        <span className="flex items-center gap-2">
          {hasChildren &&
            (open ? (
              <ChevronDown size={14} className="shrink-0 opacity-70" />
            ) : (
              <ChevronRight size={14} className="shrink-0 opacity-70" />
            ))}
          <span className="leading-snug">{node.title}</span>
        </span>
      </button>

      {hasChildren && open && (
        <div className="flex flex-col gap-2 w-full ps-3 border-s border-slate-600/60 ms-2">
          {node.children!.map((child, i) => (
            <Node
              key={i}
              node={child}
              depth={depth + 1}
              colorIndex={colorIndex}
              expandAll={expandAll}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function MindMap({
  data,
  expandAll = false,
}: {
  data: MindNode;
  expandAll?: boolean;
}) {
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 md:p-8 overflow-x-auto backdrop-blur">
      <Node node={data} expandAll={expandAll} />
    </div>
  );
}
