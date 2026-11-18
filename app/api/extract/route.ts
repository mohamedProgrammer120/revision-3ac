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

    const { image, mimeType, subject } = await req.json();

    if (!image) {
      return NextResponse.json(
        { error: "Aucune image fournie" },
        { status: 400 }
      );
    }

    // Remove data URL prefix if present
    const base64 = image.replace(/^data:image\/\w+;base64,/, "");

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 0.2 },
    });

    const isArabic = ["histoire", "arabe", "islamique"].includes(subject);

    const prompt = isArabic
      ? `أنت مساعد دراسي. استخرج النص الكامل من صورة هذا الدرس المدرسي.

القواعد:
- استخرج كل النص المقروء بدقة
- حافظ على البنية (عناوين، فقرات، نقاط)
- إذا كان النص بالعربية أبقه بالعربية
- إذا كان بالفرنسية أبقه بالفرنسية
- لا تضف أي تعليق أو شرح من عندك
- أعد النص المستخرج فقط`
      : `Tu es un assistant scolaire. Extrais le texte complet de cette photo de leçon.

Règles :
- Extrais tout le texte lisible avec précision
- Conserve la structure (titres, paragraphes, puces)
- Garde la langue originale (français ou arabe)
- N'ajoute aucun commentaire
- Retourne UNIQUEMENT le texte extrait`;

    const result = await model.generateContent([
      {
        inlineData: {
          mimeType: mimeType || "image/jpeg",
          data: base64,
        },
      },
      { text: prompt },
    ]);

    const text = result.response.text().trim();

    if (!text || text.length < 10) {
      return NextResponse.json(
        { error: "Impossible d'extraire du texte de cette image" },
        { status: 422 }
      );
    }

    return NextResponse.json({ text });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json(
      { error: e.message || "Erreur lors de l'extraction" },
      { status: 500 }
    );
  }
}
