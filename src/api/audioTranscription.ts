import type { VoiceAgentSector } from "./types";

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY || "";
const OPENAI_BASE_URL =
    process.env.REACT_APP_OPENAI_BASE_URL || "https://api.openai.com/v1";
const TRANSCRIPTION_MODEL =
    process.env.REACT_APP_TRANSCRIPTION_MODEL || "gpt-4o-transcribe";

type TranscriptionParams = {
    audioBlob: Blob;
    language: string; // "en", "hi", "te"
    sector: VoiceAgentSector;
    stream?: boolean;
};

type TranscriptionResponse = {
    text: string;
    language?: string;
    duration?: number;
};

// Domain-specific prompts for better accuracy
function getSectorPrompt(sector: VoiceAgentSector): string {
    if (sector === "agriculture") {
        return `This is a government agriculture query. Terms may include: MSP (Minimum Support Price), FCI (Food Corporation of India), procurement, commodity, yield, rabi, kharif, market yard, APMC, surplus, deficit, transport, freight, railway, road, onion, tomato, wheat, rice, state, import, export.`;
    }

    if (sector === "petroleum") {
        return `This is a government petroleum sector query. Terms may include: crude oil, refinery, ONGC, IOC, BPCL, HPCL, processing, import, export, LPG, diesel, petrol, barrel, utilization, production, trade balance, forex, reserves, pipeline, storage.`;
    }

    return "";
}

// Map language codes to OpenAI language parameters
function mapLanguageCode(languageCode: string): string {
    const languageMap: { [key: string]: string } = {
        "en-IN": "en",
        "hi-IN": "hi",
        "te-IN": "te",
        "ta-IN": "ta",
        "kn-IN": "kn",
        "mr-IN": "mr",
        "ml-IN": "ml",
        "ur-IN": "ur",
        "gu-IN": "gu",
        "pa-IN": "pa",
        "bn-IN": "bn",
    };
    return languageMap[languageCode] || "en";
}

function mapStatusToError(status: number): string {
    if (status === 401) {
        return "OpenAI API key is invalid or unauthorized.";
    }
    if (status === 429) {
        return "OpenAI rate limit reached. Please try again shortly.";
    }
    if (status === 413) {
        return "Audio file is too large. Maximum size is 25 MB.";
    }
    if (status >= 500) {
        return "OpenAI service is temporarily unavailable.";
    }
    return "Unable to transcribe audio. Please try again.";
}

export async function transcribeAudio(
    params: TranscriptionParams
): Promise<TranscriptionResponse> {
    if (!OPENAI_API_KEY) {
        throw new Error(
            "Missing OpenAI API key. Set REACT_APP_OPENAI_API_KEY in your .env file."
        );
    }

    // Check file size (25 MB limit)
    const MAX_SIZE = 25 * 1024 * 1024; // 25 MB in bytes
    if (params.audioBlob.size > MAX_SIZE) {
        throw new Error(
            `Audio file is too large (${(params.audioBlob.size / 1024 / 1024).toFixed(1)} MB). Maximum size is 25 MB.`
        );
    }

    const formData = new FormData();

    // Convert blob to file with proper extension
    const audioFile = new File(
        [params.audioBlob],
        "recording.webm",
        { type: params.audioBlob.type || "audio/webm" }
    );

    formData.append("file", audioFile);
    formData.append("model", TRANSCRIPTION_MODEL);
    formData.append("language", mapLanguageCode(params.language));
    formData.append("response_format", "json");

    // Add sector-specific prompt for better accuracy
    const prompt = getSectorPrompt(params.sector);
    if (prompt) {
        formData.append("prompt", prompt);
    }

    // Add streaming if requested
    if (params.stream) {
        formData.append("stream", "true");
    }

    try {
        const response = await fetch(`${OPENAI_BASE_URL}/audio/transcriptions`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${OPENAI_API_KEY}`,
            },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(mapStatusToError(response.status));
        }

        const data = await response.json();

        return {
            text: data.text || "",
            language: data.language,
            duration: data.duration,
        };
    } catch (error) {
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Failed to transcribe audio. Please check your connection.");
    }
}

// Helper to check if audio transcription is available
export function isTranscriptionAvailable(): boolean {
    return Boolean(OPENAI_API_KEY);
}

// Helper to get supported audio formats
export function getSupportedAudioFormats(): string[] {
    return ["audio/webm", "audio/wav", "audio/mp3", "audio/mp4", "audio/mpeg"];
}
