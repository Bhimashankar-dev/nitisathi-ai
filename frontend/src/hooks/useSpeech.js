
import { useState, useEffect, useRef } from "react";

export function useSpeech(language = "en-IN") {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState("");

  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onstart = () => {
      setIsListening(true);
      setError("");
    };

    recognition.onresult = (event) => {
      let text = "";

      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }

      setTranscript(text);
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };
    recognitionRef.current = recognition;
    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [language]);

  const startListening = () => {
    if (!recognitionRef.current) {
      setError("Voice search is unavailable.");
      return;
    }

    setTranscript("");
    setError("");

    try {
      recognitionRef.current.start();
    } catch {
      setError("Microphone is already active.");
    }
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
  };

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
  };
}
