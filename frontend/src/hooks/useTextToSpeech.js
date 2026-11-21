
import { useState, useEffect, useRef } from "react";

export function useTextToSpeech() {
  const [speakingId, setSpeakingId] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [supported, setSupported] = useState(false);

  const utteranceRef = useRef(null);

  useEffect(() => {
    setSupported(
      typeof window !== "undefined" &&
      "speechSynthesis" in window
    );

    return () => {
      window.speechSynthesis?.cancel();
    };
  }, []);

  const play = (text, language, id) => {
    if (!supported || !text) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    utterance.lang = language || "en-IN";
    utterance.rate = 0.95;
    utterance.pitch = 1;

    utterance.onstart = () => {
      setSpeakingId(id);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setSpeakingId(null);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utterance.onerror = () => {
      setSpeakingId(null);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    setSpeakingId(id);
    setIsPaused(false);

    window.speechSynthesis.speak(utterance);
  };

  const pause = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resume = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setSpeakingId(null);
    setIsPaused(false);
  };

  return {
    speakingId,
    isPaused,
    supported,
    play,
    pause,
    resume,
    stop,
  };
}
