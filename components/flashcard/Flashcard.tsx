"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Flashcard as FlashcardType } from "@/lib/db";

export default function FlashcardView({ card }: { card: FlashcardType }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div
      className="perspective-1000 h-72 cursor-pointer"
      onClick={() => setFlipped((f) => !f)}
    >
      <motion.div
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full h-full preserve-3d"
      >
        <div className="absolute inset-0 backface-hidden bg-slate-900 border border-slate-800 rounded-2xl flex items-center justify-center p-8 text-center text-xl">
          {card.front}
        </div>
        <div
          className="absolute inset-0 backface-hidden bg-cyan-500/20 border border-cyan-500/40 rounded-2xl flex items-center justify-center p-8 text-center text-xl"
          style={{ transform: "rotateY(180deg)" }}
        >
          {card.back}
        </div>
      </motion.div>
    </div>
  );
}
