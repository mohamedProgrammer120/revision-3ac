export const SUBJECTS = [
  { slug: "maths", name: "Mathématiques", icon: "📐", color: "#3b82f6", chapters: 12 },
  { slug: "physique", name: "Physique-Chimie", icon: "⚗️", color: "#a855f7", chapters: 10 },
  { slug: "svt", name: "SVT", icon: "🌱", color: "#22c55e", chapters: 8 },
  { slug: "francais", name: "Français", icon: "📖", color: "#ef4444", chapters: 9 },
  { slug: "histoire", name: "Histoire-Géo / الاجتماعيات", icon: "🌍", color: "#f59e0b", chapters: 11 },
  { slug: "anglais", name: "Anglais", icon: "🇬🇧", color: "#ec4899", chapters: 8 },
  { slug: "arabe", name: "العربية", icon: "🕌", color: "#14b8a6", chapters: 10 },
  { slug: "islamique", name: "التربية الإسلامية", icon: "📿", color: "#6366f1", chapters: 6 },
] as const;

export type SubjectSlug = (typeof SUBJECTS)[number]["slug"];

/** Matières dont le contenu IA est en arabe */
export const ARABIC_SUBJECTS: SubjectSlug[] = ["histoire", "arabe", "islamique"];
