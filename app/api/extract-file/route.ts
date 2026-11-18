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

    const { data, mimeType, fileName, subject } = await req.json();

    if (!data) {
      return NextResponse.json(
        { error: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Strip data URL prefix if present
    const base64 = data.replace(/^data:[^;]+;base64,/, "");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 0.1 },
    });

    const isArabic = ["histoire", "arabe", "islamique"].includes(subject);

    const prompt = isArabic
      ? `أنت مساعد دراسي. استخرج النص الكامل من هذا الملف الدراسي (PDF أو مستند).

القواعد:
- استخرج كل النص المقروء بدقة
- حافظ على البنية (عناوين، فقرات، نقاط، جداول إن أمكن)
- أبقِ اللغة الأصلية (عربية أو فرنسية)
- لا تضف أي تعليق أو شرح
- أعد النص المستخرج فقط`
      : `Tu es un assistant scolaire. Extrais le texte complet de ce document scolaire (PDF ou fichier).

Règles :
- Extrais tout le texte lisible avec précision
- Conserve la structure (titres, paragraphes, puces, tableaux si possible)
- Garde la langue originale (français ou arabe)
- N'ajoute aucun commentaire ni explication
- Retourne UNIQUEMENT le texte extrait`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType || "application/pdf",
          data: base64,
        },
      },
      { text: prompt },
    ]);

    const text = result.response.text().trim();

    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: "Impossible d'extraire du texte de ce fichier" },
        { status: 422 }
      );
    }

    // Suggest a title from filename
    const suggestedTitle = fileName
      ? fileName.replace(/\.(pdf|txt|md|text)$/i, "").replace(/[_-]/g, " ")
      : "";

    return NextResponse.json({ text, suggestedTitle });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Erreur lors de l'extraction du fichier" },
      { status: 500 }
    );
  }
}
