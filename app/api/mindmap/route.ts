import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

const ARABIC_SUBJECTS = ["histoire", "arabe", "islamique"];

export async function POST(req: NextRequest) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "GEMINI_API_KEY manquante" },
        { status: 500 }
      );
    }

    const { content, title, subject } = await req.json();
    if (!content || content.length < 20) {
      return NextResponse.json(
        { error: "Contenu trop court" },
        { status: 400 }
      );
    }

    const useArabic = ARABIC_SUBJECTS.includes(subject);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.45,
      },
    });

    const prompt = useArabic
      ? `أنت أستاذ خبير في السلك الإعدادي بالمغرب (السنة الثالثة إعدادي 3AC).
أنشئ خطاطة ذهنية شاملة، دقيقة ومحكمة المنطق انطلاقاً من هذا الدرس.

القواعد الصارمة:
- العقدة الجذرية = عنوان الدرس الأساسي.
- من 4 إلى 7 فروع رئيسية تغطي المحور الأساسي للدرس.
- كل فرع رئيسي يحتوي على 2 إلى 4 فروع فرعية (مع إمكانية مستوى ثالث للتفاصيل الدقيقة كالتعاريف أو التواريخ أو القوانين).
- يجب أن تكون كل عقدة قصيرة جداً ومركزة (3 إلى 7 كلمات كحد أقصى).
- **كل النصوص باللغة العربية الفصحى الأكاديمية والواضحة**.
- التركيز على المفاهيم المفاتيح، التواريخ، الأسباب والنتائج، القواعد، والخلاصات.

صيغة JSON حصرياً ودون أي نص إضافي:
{
  "title": "عنوان الدرس",
  "children": [
    {
      "title": "فرع رئيسي",
      "children": [
        { "title": "مفهوم فرعي" },
        { "title": "عنصر", "children": [{ "title": "تفصيل دقيق" }] }
      ]
    }
  ]
}

عنوان الدرس: ${title || "الدرس"}

محتوى الدرس:
"""
${content}
"""`
      : `Tu es un professeur expert de 3ème année collège (Maroc - 3AC).
Crée une carte mentale (MindMap) extrêmement structurée, claire et riche à partir de cette leçon.

Règles STRICTES :
- Nœud racine = Titre principal du sujet.
- 4 à 7 branches principales couvrant les axes fondamentaux.
- Chaque branche : 2 à 4 sous-branches (niveau 3 possible pour les définitions, formules ou dates clés).
- Chaque nœud : phrase très courte, percutante (3 à 7 mots maximum).
- En français correct et académique.
- Focus sur les définitions, lois, causes/conséquences, étapes et faits marquants.

Format JSON strict uniquement :
{
  "title": "Titre du sujet",
  "children": [
    {
      "title": "Branche principale",
      "children": [
        { "title": "Sous-point" },
        { "title": "Sous-point", "children": [{ "title": "Détail clé" }] }
      ]
    }
  ]
}

Titre : ${title || "Leçon"}

Contenu :
"""
${content}
"""`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const parsed = JSON.parse(text);
    return NextResponse.json(parsed);
  } catch (e: unknown) {
    console.error(e);
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Erreur" },
      { status: 500 }
    );
  }
}
