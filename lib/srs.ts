import { db, Flashcard } from "./db";

/**
 * Algorithme SM-2 (SuperMemo 2)
 * quality: 0 = oublié, 3 = difficile, 4 = bien, 5 = facile
 */
export async function reviewCard(card: Flashcard, quality: number) {
  let { ease, interval, repetitions } = card;

  if (quality < 3) {
    repetitions = 0;
    interval = 1;
  } else {
    if (repetitions === 0) interval = 1;
    else if (repetitions === 1) interval = 6;
    else interval = Math.round(interval * ease);

    repetitions++;
    ease = ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (ease < 1.3) ease = 1.3;
  }

  const dueDate = Date.now() + interval * 24 * 60 * 60 * 1000;
  await db.flashcards.update(card.id!, {
    ease,
    interval,
    repetitions,
    dueDate,
  });
}

export async function getDueCards(subject?: string) {
  const now = Date.now();
  const cards = await db.flashcards.toArray();
  return cards.filter(
    (c) => c.dueDate <= now && (!subject || c.subject === subject)
  );
}
