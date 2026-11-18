import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY manquante" },
        { status: 500 }
      );
    }

    const { content, subject } = await req.json();
    if (!content || content.length < 30) {
      return NextResponse.json(
        { error: "Contenu trop court" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.6,
      },
    });

    const prompt = `Tu es un professeur de 3ème année collège (Maroc).
À partir de cette leçon, génère exactement 8 flashcards de révision.

Règles :
- front = question ou terme court
- back = réponse claire et concise
- Adapté au niveau 3AC
- En français

Format JSON strict :
{ "cards": [ { "front": "...", "back": "..." } ] }

Leçon :
"""
${content}
"""`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Erreur" },
      { status: 500 }
    );
  }
}
