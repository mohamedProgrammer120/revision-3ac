const GEMINI_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/interactions";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-4-hydrogen";

export type GeminiContent =
  | { type: "text"; text: string }
  | { type: "image" | "document"; data: string; mime_type: string };

export async function generateWithGemini(
  input: string | GeminiContent[],
  json = false
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) throw new Error("GEMINI_API_KEY manquante. Configure-la dans les variables d'environnement.");

  const response = await fetch(GEMINI_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": apiKey,
      "Api-Revision": "2026-05-20",
    },
    body: JSON.stringify({
      model: GEMINI_MODEL,
      input,
      ...(json
        ? { response_format: { type: "text", mime_type: "application/json" } }
        : {}),
    }),
    signal: AbortSignal.timeout(90_000),
    cache: "no-store",
  });

  const payload = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      payload?.error?.message ||
      payload?.message ||
      `Erreur Gemini (HTTP ${response.status})`;
    throw new Error(message);
  }

  const outputText =
    payload?.output_text ||
    payload?.steps
      ?.filter((step: { type?: string }) => step.type === "model_output")
      .flatMap((step: { content?: { type?: string; text?: string }[] }) => step.content || [])
      .filter((part: { type?: string }) => part.type === "text")
      .map((part: { text?: string }) => part.text || "")
      .join("\n");

  if (typeof outputText !== "string" || !outputText.trim()) {
    throw new Error("Gemini n'a retourné aucun contenu. Réessaie dans quelques instants.");
  }
  return outputText.trim();
}

export function parseGeminiJson<T>(text: string): T {
  const cleaned = text.replace(/^﻿/, "").trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) {
      return JSON.parse(cleaned.slice(start, end + 1)) as T;
    }
    throw new Error("La réponse IA n'est pas un JSON valide. Réessaie.");
  }
}

export function errorMessage(error: unknown, fallback = "Une erreur est survenue"): string {
  return error instanceof Error ? error.message : fallback;
}
