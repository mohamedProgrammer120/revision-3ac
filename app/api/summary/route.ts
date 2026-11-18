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

    const { content } = await req.json();
    if (!content || content.length < 30) {
      return NextResponse.json(
        { error: "Contenu trop court" },
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 0.4 },
    });

    const prompt = `Tu es un professeur de collège (3AC Maroc).
Fais un résumé clair, structuré et concis de cette leçon en français.
Utilise des puces si nécessaire. Maximum 150 mots.

Leçon :
"""
${content}
"""`;

    const result = await model.generateContent(prompt);
    const summary = result.response.text();
    return NextResponse.json({ summary });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Erreur" },
      { status: 500 }
    );
  }
}
