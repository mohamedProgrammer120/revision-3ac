import Dexie, { Table } from "dexie";

export interface Lesson {
  id?: number;
  subject: string;
  title: string;
  content: string;
  summary?: string;
  mastered: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface QuizAttempt {
  id?: number;
  subject: string;
  lessonId?: number;
  questions: { q: string; options: string[]; correct: number }[];
  answers: number[];
  score: number;
  total: number;
  createdAt: number;
}

export interface Flashcard {
  id?: number;
  subject: string;
  front: string;
  back: string;
  ease: number;
  interval: number;
  repetitions: number;
  dueDate: number;
  createdAt: number;
}

export interface MindNode {
  title: string;
  children?: MindNode[];
}

export interface SavedMindMap {
  id?: number;
  lessonId?: number;
  subject: string;
  title: string;
  data: MindNode;
  createdAt: number;
}

export interface UserStats {
  id?: number;
  lastActive: number;
  streak: number;
  xp: number;
  badges: string[];
}

export class HubDB extends Dexie {
  lessons!: Table<Lesson>;
  attempts!: Table<QuizAttempt>;
  flashcards!: Table<Flashcard>;
  mindmaps!: Table<SavedMindMap>;
  userStats!: Table<UserStats>;

  constructor() {
    super("hub-3ac");
    this.version(1).stores({
      lessons: "++id, subject, mastered, updatedAt",
      attempts: "++id, subject, createdAt",
      flashcards: "++id, subject, dueDate",
    });
    // v2: mind maps
    this.version(2).stores({
      lessons: "++id, subject, mastered, updatedAt",
      attempts: "++id, subject, createdAt",
      flashcards: "++id, subject, dueDate",
      mindmaps: "++id, subject, lessonId, createdAt",
    });
    // v3: user stats
    this.version(3).stores({
      lessons: "++id, subject, mastered, updatedAt",
      attempts: "++id, subject, createdAt",
      flashcards: "++id, subject, dueDate",
      mindmaps: "++id, subject, lessonId, createdAt",
      userStats: "++id",
    });
  }
}

export const db = new HubDB();
