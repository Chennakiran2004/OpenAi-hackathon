import React, {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
  HiMicrophone,
  HiX,
  HiSpeakerphone,
  HiExclamationCircle,
  HiClock,
  HiStop,
} from "react-icons/hi";
import { queryVoiceAgentOpenAI } from "../../api/openaiClient";
import { transcribeAudio, isTranscriptionAvailable } from "../../api/audioTranscription";
import type {
  VoiceAgentConfidence,
  VoiceAgentDomain,
  VoiceAgentResponse,
  VoiceAgentSector,
} from "../../api/types";
import {
  VOICE_AGENT_MISSING_DATA_RESPONSE,
  VOICE_AGENT_PROMPT_VERSION,
  VOICE_AGENT_UNSUPPORTED_RESPONSE,
} from "../../config/voiceAgentSystemPrompt";

interface VoiceAgentProps {
  sector: VoiceAgentSector;
  hideFab?: boolean;
}

export type VoiceAgentHandle = {
  open: () => void;
  close: () => void;
};

type VoiceStatus = "idle" | "listening" | "processing" | "speaking" | "error";

const MOCK_MODE = process.env.REACT_APP_VOICE_AGENT_MOCK === "true";

function getSectorTitle(sector: VoiceAgentSector): string {
  return sector === "petroleum"
    ? "Petroleum Intelligence Voice Agent"
    : "Bharat Krishi Setu Voice Agent";
}

function classifyMockDomain(
  transcript: string,
  sector: VoiceAgentSector
): VoiceAgentDomain {
  const unsupportedKeywords = [
    "movie",
    "music",
    "cricket",
    "football",
    "stock",
    "bitcoin",
    "celebrity",
  ];
  const lower = transcript.toLowerCase();
  if (unsupportedKeywords.some((word) => lower.includes(word))) {
    return "unsupported";
  }
  return sector;
}

function buildMockResponse(
  transcript: string,
  sector: VoiceAgentSector
): VoiceAgentResponse {
  const domain = classifyMockDomain(transcript, sector);

  if (domain === "unsupported") {
    return {
      reply_text: VOICE_AGENT_UNSUPPORTED_RESPONSE,
      confidence: "high",
      domain: "unsupported",
      language: "English",
      data_timestamp: new Date().toISOString(),
    };
  }

  if (transcript.trim().length < 4) {
    return {
      reply_text: VOICE_AGENT_MISSING_DATA_RESPONSE,
      confidence: "medium",
      domain,
      language: "English",
      data_timestamp: new Date().toISOString(),
    };
  }

  const reply =
    sector === "petroleum"
      ? "Petroleum summary: I can assist with crude forecast, refinery utilization, demand-supply gap, import costs, and trade balance insights from available government datasets."
      : "Agriculture summary: I can assist with optimization, forecast trends, surplus or deficit indicators, and carbon-aware sourcing insights from available government datasets.";

  return {
    reply_text: reply,
    confidence: "medium",
    domain,
    language: "English",
    data_timestamp: new Date().toISOString(),
  };
}

const VoiceAgent = forwardRef<VoiceAgentHandle, VoiceAgentProps>(function VoiceAgent(
  { sector, hideFab = false }: VoiceAgentProps,
  ref
) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const modalRef = useRef<HTMLDivElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState<VoiceStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [reply, setReply] = useState("");
  const [confidence, setConfidence] = useState<VoiceAgentConfidence | string>("");
  const [dataTimestamp, setDataTimestamp] = useState("");
  const [domain, setDomain] = useState<VoiceAgentDomain | string>("");
  const [errorMessage, setErrorMessage] = useState("");
  const [recordingDuration, setRecordingDuration] = useState(0);

  const recognitionSupported = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  const mediaRecorderSupported = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  }, []);

  const [selectedLanguage, setSelectedLanguage] = useState<string>("en-IN");

  const languageOptions = [
    { value: "en-IN", label: "English", speechLang: "en-IN" },
    { value: "hi-IN", label: "हिन्दी (Hindi)", speechLang: "hi-IN" },
    { value: "te-IN", label: "తెలుగు (Telugu)", speechLang: "te-IN" },
    { value: "ta-IN", label: "தமிழ் (Tamil)", speechLang: "ta-IN" },
    { value: "kn-IN", label: "ಕನ್ನಡ (Kannada)", speechLang: "kn-IN" },
    { value: "mr-IN", label: "मराठी (Marathi)", speechLang: "mr-IN" },
    { value: "ml-IN", label: "മലയാളം (Malayalam)", speechLang: "ml-IN" },
    { value: "ur-IN", label: "اردو (Urdu)", speechLang: "ur-IN" },
    { value: "gu-IN", label: "ગુજરાતી (Gujarati)", speechLang: "gu-IN" },
    { value: "pa-IN", label: "ਪੰਜਾਬੀ (Punjabi)", speechLang: "pa-IN" },
    { value: "bn-IN", label: "বাংলা (Bengali)", speechLang: "bn-IN" },
  ];

  function getLanguageOption(langCode: string) {
    return languageOptions.find(opt => opt.value === langCode);
  }

  function resetOutput() {
    setReply("");
    setConfidence("");
    setDataTimestamp("");
    setDomain("");
    setErrorMessage("");
  }

  const handleOpen = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    if (recognitionRef.current && status === "listening") {
      recognitionRef.current.stop();
    }
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
      // Stop all media tracks
      const stream = mediaRecorderRef.current.stream;
      stream.getTracks().forEach(track => track.stop());
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setStatus("idle");
    setIsOpen(false);
    setTimeout(() => triggerRef.current?.focus(), 0);
  }, [status]);

  useImperativeHandle(
    ref,
    () => ({
      open: handleOpen,
      close: handleClose,
    }),
    [handleOpen, handleClose]
  );

  useEffect(() => {
    if (!isOpen) return undefined;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [isOpen, handleClose]);

  useEffect(() => {
    if (!isOpen) return;
    modalRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.stop();
      }
      if (window.speechSynthesis && utteranceRef.current) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Recording duration timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (status === "listening") {
      setRecordingDuration(0);
      interval = setInterval(() => {
        setRecordingDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [status]);

  async function stopRecording() {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop();
    }
  }

  async function startRecording() {
    resetOutput();
    setRecordingDuration(0);

    // Check if OpenAI transcription is available
    const useOpenAITranscription = isTranscriptionAvailable() && mediaRecorderSupported;

    if (useOpenAITranscription) {
      // Use OpenAI transcription with MediaRecorder
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

        // Try to use webm first, fallback to other formats
        const mimeType = MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4')
            ? 'audio/mp4'
            : 'audio/wav';

        const mediaRecorder = new MediaRecorder(stream, { mimeType });
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          // Stop all tracks
          stream.getTracks().forEach(track => track.stop());

          if (audioChunksRef.current.length === 0) {
            setStatus("error");
            setErrorMessage("No audio was recorded. Please try again.");
            return;
          }

          // Create blob from recorded chunks
          const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

          // Transcribe using OpenAI
          setStatus("processing");
          try {
            const result = await transcribeAudio({
              audioBlob,
              language: selectedLanguage,
              sector,
            });

            if (result.text.trim()) {
              setTranscript(result.text);
              submitTranscript(result.text);
            } else {
              setStatus("error");
              setErrorMessage("No speech detected in the recording.");
            }
          } catch (error) {
            setStatus("error");
            const message =
              error instanceof Error
                ? error.message
                : "Failed to transcribe audio. Please try again.";
            setErrorMessage(message);
          }
        };

        mediaRecorder.onerror = () => {
          setStatus("error");
          setErrorMessage("Error recording audio. Please check microphone permissions.");
        };

        mediaRecorderRef.current = mediaRecorder;
        setStatus("listening");
        mediaRecorder.start();
      } catch (error) {
        setStatus("error");
        const message =
          error instanceof Error && error.name === "NotAllowedError"
            ? "Microphone access denied. Please allow microphone access and try again."
            : "Unable to access microphone. Please check your settings.";
        setErrorMessage(message);
      }
    } else {
      // Fallback to browser SpeechRecognition
      if (!recognitionSupported) {
        setStatus("error");
        setErrorMessage(
          "Speech recognition is not supported. Please type your query."
        );
        return;
      }

      const SpeechRecognitionClass =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognitionClass) return;

      const recognition = new SpeechRecognitionClass();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = selectedLanguage;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const parts: string[] = [];
        for (let index = 0; index < event.results.length; index += 1) {
          const result = event.results[index];
          if (result?.[0]?.transcript) {
            parts.push(result[0].transcript);
          }
        }
        const finalTranscript = parts.join(" ").trim();
        if (finalTranscript) {
          setTranscript(finalTranscript);
          submitTranscript(finalTranscript);
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setStatus("error");
        setErrorMessage(event.message || "Unable to capture voice input.");
      };

      recognition.onend = () => {
        setStatus((current) => (current === "listening" ? "idle" : current));
      };

      recognitionRef.current = recognition;
      setStatus("listening");
      recognition.start();
    }
  }

  function speak(text: string, responseLang?: string): boolean {
    if (typeof window === "undefined" || !window.speechSynthesis) return false;

    window.speechSynthesis.cancel();

    // Map response language name back to language code
    let speechLang = selectedLanguage;
    if (responseLang) {
      // Find matching language option by comparing language names
      const langOption = languageOptions.find(opt =>
        opt.label.toLowerCase().includes(responseLang.toLowerCase())
      );
      if (langOption) {
        speechLang = langOption.speechLang;
      }
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = speechLang;
    utterance.rate = 1;
    utterance.pitch = 1;

    utterance.onstart = () => setStatus("speaking");
    utterance.onend = () => {
      setStatus("idle");
      setRecordingDuration(0);
    };
    utterance.onerror = () => {
      setStatus("idle");
      setRecordingDuration(0);
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    return true;
  }

  function stopSpeaking() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setStatus("idle");
    setRecordingDuration(0);
  }

  async function submitTranscript(text: string) {
    const cleanText = text.trim();
    if (!cleanText) {
      setStatus("error");
      setErrorMessage("Please provide a voice or text query.");
      return;
    }

    setStatus("processing");
    setErrorMessage("");

    try {
      const data = MOCK_MODE
        ? buildMockResponse(cleanText, sector)
        : await queryVoiceAgentOpenAI({
          sector,
          transcript: cleanText,
          language: selectedLanguage,
          context: window.location.pathname,
          promptVersion: VOICE_AGENT_PROMPT_VERSION,
        });

      setReply(data.reply_text);
      setConfidence(data.confidence || "");
      setDataTimestamp(data.data_timestamp || "");
      setDomain(data.domain || "");
      const didSpeak = speak(data.reply_text, data.language || selectedLanguage);
      if (!didSpeak) {
        setStatus("idle");
      }
    } catch (error) {
      setStatus("error");
      const message =
        error instanceof Error
          ? error.message
          : "Voice service is currently unavailable.";
      setErrorMessage(message);
      setReply(VOICE_AGENT_MISSING_DATA_RESPONSE);
    }
  }

  function handleSubmitQuery() {
    submitTranscript(transcript);
  }

  const content = (
    <>
      {!hideFab && (
        <button
          ref={triggerRef}
          type="button"
          onClick={handleOpen}
          className="voice-agent-fab"
          aria-label="Open voice agent"
        >
          <HiMicrophone className="w-6 h-6" />
        </button>
      )}

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="voice-agent-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          >
            <motion.div
              ref={modalRef}
              className="voice-agent-modal"
              role="dialog"
              aria-modal="true"
              aria-labelledby="voice-agent-title"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.9, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 260, damping: 24 }}
              onClick={(event) => event.stopPropagation()}
            >
              <div className="voice-agent-header">
                <h2 id="voice-agent-title" className="voice-agent-title">
                  {getSectorTitle(sector)}
                </h2>
                <button
                  type="button"
                  className="voice-agent-close"
                  onClick={handleClose}
                  aria-label="Close voice agent"
                >
                  <HiX className="w-5 h-5" />
                </button>
              </div>

              <div className="voice-agent-body">
                <div className="voice-agent-status-row">
                  <div className="voice-agent-status">
                    <span
                      className={`voice-status-dot ${status === "listening"
                        ? "is-listening"
                        : status === "processing"
                          ? "is-processing"
                          : status === "speaking"
                            ? "is-speaking"
                            : status === "error"
                              ? "is-error"
                              : ""
                        }`}
                    />
                    <span className="text-sm font-semibold text-gray-700 capitalize">
                      {status === "processing" && recordingDuration > 0
                        ? "Transcribing"
                        : status === "listening"
                          ? "Recording"
                          : status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    Prompt version: {VOICE_AGENT_PROMPT_VERSION}
                  </p>
                </div>

                {/* Language Selector */}
                <div style={{ marginBottom: '1rem' }}>
                  <label
                    htmlFor="language-select"
                    style={{
                      display: 'block',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: 'var(--color-gray-700)',
                      marginBottom: '0.5rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em'
                    }}
                  >
                    Response Language
                  </label>
                  <select
                    id="language-select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    disabled={status === "listening" || status === "processing" || status === "speaking"}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.75rem',
                      border: '1px solid var(--color-gray-300)',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--color-gray-800)',
                      backgroundColor: '#fff',
                      cursor: status === "listening" || status === "processing" || status === "speaking" ? 'not-allowed' : 'pointer',
                      opacity: status === "listening" || status === "processing" || status === "speaking" ? 0.6 : 1
                    }}
                  >
                    {languageOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="voice-agent-mic-wrap">
                  {status === "speaking" ? (
                    <button
                      type="button"
                      onClick={stopSpeaking}
                      className="voice-agent-mic active"
                      aria-label="Stop speaking"
                      style={{
                        backgroundColor: 'var(--color-error)',
                        borderColor: 'var(--color-error)'
                      }}
                    >
                      <HiStop className="w-9 h-9" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={
                        status === "listening" ? stopRecording : startRecording
                      }
                      className={`voice-agent-mic ${status === "listening" ? "active" : ""}`}
                      aria-label={status === "listening" ? "Stop recording" : "Start recording"}
                    >
                      <HiMicrophone className="w-9 h-9" />
                    </button>
                  )}
                  {status === "listening" && (
                    <>
                      <div className="voice-agent-ring" aria-hidden="true" />
                    </>
                  )}
                  {(status === "listening" || status === "speaking") && (
                    <div className="voice-agent-lottie-wrap">
                      <DotLottieReact
                        src="/animations/listening.lottie"
                        loop
                        autoplay
                      />
                    </div>
                  )}
                </div>

                <textarea
                  value={transcript}
                  onChange={(event) => setTranscript(event.target.value)}
                  className="voice-agent-textarea"
                  placeholder="Speak or type your question..."
                  rows={3}
                />

                <div className="voice-agent-actions">
                  <button
                    type="button"
                    className="voice-agent-submit"
                    onClick={handleSubmitQuery}
                    disabled={status === "processing"}
                  >
                    {status === "processing" ? "Processing..." : "Send Query"}
                  </button>
                </div>

                {errorMessage && (
                  <div className="voice-agent-error">
                    <HiExclamationCircle className="w-5 h-5 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {reply && (
                  <div className="voice-agent-response">
                    <div className="voice-agent-response-title">
                      <HiSpeakerphone className="w-5 h-5" />
                      <span>Assistant Response</span>
                    </div>
                    <p className="text-sm text-gray-700">{reply}</p>

                    <div className="voice-agent-metadata">
                      {domain ? (
                        <span className="voice-agent-chip">
                          Domain: {domain}
                        </span>
                      ) : null}
                      {confidence ? (
                        <span className="voice-agent-chip">
                          Confidence: {confidence}
                        </span>
                      ) : null}
                      {dataTimestamp ? (
                        <span className="voice-agent-chip">
                          <HiClock className="w-3.5 h-3.5" />
                          {new Date(dataTimestamp).toLocaleString()}
                        </span>
                      ) : null}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );

  if (typeof document === "undefined") {
    return null;
  }

  return createPortal(content, document.body);
});

export default VoiceAgent;
