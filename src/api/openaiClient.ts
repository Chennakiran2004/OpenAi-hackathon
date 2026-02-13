import type { VoiceAgentResponse, VoiceAgentSector } from "./types";
import {
  VOICE_AGENT_MISSING_DATA_RESPONSE,
  VOICE_AGENT_SYSTEM_PROMPT,
  VOICE_AGENT_UNSUPPORTED_RESPONSE,
} from "../config/voiceAgentSystemPrompt";

type QueryVoiceAgentOpenAIParams = {
  sector: VoiceAgentSector;
  transcript: string;
  language?: string;
  context?: string;
  promptVersion?: string;
};

// API key and options are set via env vars; see .env.example for required keys (copy to .env and set values).
const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || "";
const OPENAI_MODEL = process.env.REACT_APP_OPENAI_MODEL || "gpt-4o-mini";
const OPENAI_BASE_URL =
  process.env.REACT_APP_OPENAI_BASE_URL || "https://api.openai.com/v1";

const SUPPORTED_DOMAINS = new Set(["agriculture", "petroleum", "unsupported"]);
const SUPPORTED_CONFIDENCE = new Set(["low", "medium", "high"]);

function extractAssistantText(payload: unknown): string {
  if (!payload || typeof payload !== "object") return "";
  const choices = (payload as { choices?: unknown[] }).choices;
  if (!Array.isArray(choices) || choices.length === 0) return "";
  const first = choices[0] as {
    message?: { content?: string | Array<{ type?: string; text?: string }> };
  };
  const content = first?.message?.content;
  if (typeof content === "string") return content.trim();
  if (Array.isArray(content)) {
    return content
      .map((part) =>
        part && typeof part === "object" && "text" in part
          ? String(part.text || "")
          : ""
      )
      .join("")
      .trim();
  }
  return "";
}

function stripCodeFence(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.startsWith("```")) return trimmed;
  return trimmed
    .replace(/^```[a-zA-Z]*\s*/, "")
    .replace(/\s*```$/, "")
    .trim();
}

function parseModelOutput(
  raw: string,
  sector: VoiceAgentSector
): VoiceAgentResponse {
  if (!raw.trim()) {
    return {
      reply_text: VOICE_AGENT_MISSING_DATA_RESPONSE,
      confidence: "medium",
      domain: sector,
      data_timestamp: new Date().toISOString(),
    };
  }

  const clean = stripCodeFence(raw);
  try {
    const parsed = JSON.parse(clean) as {
      reply_text?: string;
      confidence?: string;
      domain?: string;
      language?: string;
      data_timestamp?: string;
    };

    const normalizedDomain = SUPPORTED_DOMAINS.has(parsed.domain || "")
      ? parsed.domain
      : sector;
    const normalizedConfidence = SUPPORTED_CONFIDENCE.has(parsed.confidence || "")
      ? parsed.confidence
      : "medium";
    const reply = (parsed.reply_text || "").trim();

    if (!reply) {
      return {
        reply_text: VOICE_AGENT_MISSING_DATA_RESPONSE,
        confidence: "medium",
        domain: normalizedDomain,
        language: parsed.language || "English",
        data_timestamp: parsed.data_timestamp || new Date().toISOString(),
      };
    }

    if (normalizedDomain === "unsupported") {
      return {
        reply_text: VOICE_AGENT_UNSUPPORTED_RESPONSE,
        confidence: normalizedConfidence,
        domain: "unsupported",
        language: parsed.language || "English",
        data_timestamp: parsed.data_timestamp || new Date().toISOString(),
      };
    }

    return {
      reply_text: reply,
      confidence: normalizedConfidence,
      domain: normalizedDomain,
      language: parsed.language || "English",
      data_timestamp: parsed.data_timestamp || new Date().toISOString(),
    };
  } catch {
    return {
      reply_text: clean || VOICE_AGENT_MISSING_DATA_RESPONSE,
      confidence: "medium",
      domain: sector,
      data_timestamp: new Date().toISOString(),
    };
  }
}

function mapStatusToError(status: number): string {
  if (status === 401) {
    return "OpenAI API key is invalid or unauthorized.";
  }
  if (status === 429) {
    return "OpenAI rate limit reached. Please try again shortly.";
  }
  if (status >= 500) {
    return "OpenAI service is temporarily unavailable.";
  }
  return "Unable to process voice query via OpenAI.";
}

export async function queryVoiceAgentOpenAI(
  params: QueryVoiceAgentOpenAIParams
): Promise<VoiceAgentResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error(
      "Missing OpenAI API key. Copy .env.example to .env and set REACT_APP_OPENAI_API_KEY with your key."
    );
  }

  const languageMap: { [key: string]: string } = {
    "en-IN": "English",
    "hi-IN": "Hindi",
    "te-IN": "Telugu",
    "ta-IN": "Tamil",
    "kn-IN": "Kannada",
    "mr-IN": "Marathi",
    "ml-IN": "Malayalam",
    "ur-IN": "Urdu",
    "gu-IN": "Gujarati",
    "pa-IN": "Punjabi",
    "bn-IN": "Bengali",
  };

  const languageName = languageMap[params.language || "en-IN"] || "English";

  const instruction = [
    "Return strictly JSON object with keys:",
    "reply_text (string), confidence (low|medium|high),",
    "domain (agriculture|petroleum|unsupported), language (string),",
    "data_timestamp (ISO-8601 string).",
    `IMPORTANT: Respond in ${languageName} language. The reply_text must be in ${languageName}.`,
    `Use "${VOICE_AGENT_MISSING_DATA_RESPONSE}" when data is unavailable.`,
    `Use "${VOICE_AGENT_UNSUPPORTED_RESPONSE}" for unsupported domains.`,
  ].join(" ");

  const userContext = [
    `sector: ${params.sector}`,
    `response_language: ${languageName}`,
    `route_context: ${params.context || "unknown"}`,
    `prompt_version: ${params.promptVersion || "v1"}`,
    `query: ${params.transcript}`,
  ].join("\n");

  const response = await fetch(`${OPENAI_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      temperature: 0,
      messages: [
        { role: "system", content: VOICE_AGENT_SYSTEM_PROMPT },
        { role: "system", content: instruction },
        { role: "user", content: userContext },
      ],
    }),
  });

  if (!response.ok) {
    throw new Error(mapStatusToError(response.status));
  }

  const payload = (await response.json()) as unknown;
  const text = extractAssistantText(payload);
  return parseModelOutput(text, params.sector);
}
