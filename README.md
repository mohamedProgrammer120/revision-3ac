# Hub 3AC — Révisions 3ème collège (Maroc)

## Fonctionnalités

| Module | Description |
|--------|-------------|
| **Dashboard** | Stats, progression, raccourcis |
| **Matières / Leçons** | CRUD + import **texte / PDF / photo OCR** |
| **Quiz IA** | QCM Gemini depuis une leçon |
| **Examen blanc** | QCM chronométré |
| **Flashcards** | SM-2 + création manuelle + IA |
| **خطاطات / Mind maps** | IA FR ou AR + sauvegarde + plein écran |
| **Résumé IA** | Synthèse d'une leçon |
| **Stats** | Graphiques + historique |
| **Paramètres** | Export / import JSON, seed, reset |
| **PWA** | Installable + offline |

## Setup

```bash
npm install
```

`.env.local` :

```
GEMINI_API_KEY=ta_cle_google_ai_studio
```

Sur **Vercel** : Project → Settings → Environment Variables → `GEMINI_API_KEY`

```bash
npm run dev
```

## Parcours type

1. Dashboard → **Charger données d'exemple** (ou ouvrir une matière)
2. Matière → **Nouvelle leçon** (coller / PDF / photo)
3. Ouvrir la leçon → Résumer / Flashcards / خطاطة / Quiz
4. Réviser dans Flashcards + Examen blanc

## Note API

Sans `GEMINI_API_KEY`, l'interface marche mais **aucune génération IA** (quiz, résumé, PDF, OCR, mind map).
