import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY manquante. Ajoute-la dans .env.local" },
        { status: 500 }
      );
    }

    const { lesson, count = 5 } = await req.json();
    if (!lesson || lesson.length < 50) {
      return NextResponse.json(
        { error: "Leçon trop courte (minimum 50 caractères)" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.7,
      },
    });

    const prompt = `Tu es un professeur expert de 3ème année collège (Maroc - 3AC).
Génère exactement ${count} questions de type QCM de haute qualité basées sur la leçon suivante.

Règles STRICTES :
- Varie les types de questions (définitions, causes/conséquences, application directe, calculs ou dates selon la matière).
- 4 options par question.
- 1 seule bonne réponse correcte.
- Explication pédagogique claire (1-2 phrases) pour chaque question.
- Niveau adapté au programme marocain 3AC.

Format JSON strict :
{
  "questions": [
    {
      "question": "Texte de la question ?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Explication pédagogique de la bonne réponse."
    }
  ]
}

Leçon :
"""
${lesson}
"""`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Erreur lors de la génération" },
      { status: 500 }
    );
  }
}
