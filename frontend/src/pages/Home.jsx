
import { useState, useEffect } from "react";

import {
  Landmark,
  Scale,
  GraduationCap,
  CreditCard,
  ArrowUp,
  Mic,
  Sparkles,
  ShieldCheck,
  FileText,
  LoaderCircle,
} from "lucide-react";

import { useSpeech } from "../hooks/useSpeech";
import { useTextToSpeech } from "../hooks/useTextToSpeech";

import MessageBubble from "../components/MessageBubble";

import {
  createChat,
  askAI,
  getChatById,
} from "../services/api";

import "../styles/chat.css";

function Home({ activeChat }) {
  const [question, setQuestion] = useState("");
  const [voiceLanguage, setVoiceLanguage] = useState("en-IN");
  const [messages, setMessages] = useState([]);
  const [chatId, setChatId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [apiError, setApiError] = useState("");

  
  const {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
  } = useSpeech(voiceLanguage);

  
  const {
    speakingId,
    isPaused,
    supported,
    play,
    pause,
    resume,
    stop,
  } = useTextToSpeech();

  
  useEffect(() => {
    if (transcript) {
      setQuestion(transcript);
    }
  }, [transcript]);

  
  useEffect(() => {
    let cancelled = false;

    
    stop();

    if (!activeChat?._id) {
      setChatId(null);
      setMessages([]);
      setQuestion("");
      setApiError("");
      setLoadingHistory(false);

      return () => {
        cancelled = true;
      };
    }

    const loadConversation = async () => {
      setLoadingHistory(true);
      setMessages([]);
      setQuestion("");
      setApiError("");

      try {
        const chat = await getChatById(activeChat._id);

        if (!cancelled) {
          setChatId(chat._id);
          setMessages(chat.messages || []);
        }
      } catch (err) {
        console.error("Chat history error:", err);

        if (!cancelled) {
          setApiError("Unable to load this conversation.");
        }
      } finally {
        if (!cancelled) {
          setLoadingHistory(false);
        }
      }
    };

    loadConversation();

    return () => {
      cancelled = true;
    };
  }, [activeChat]);

  
  const categories = [
    {
      title: "Government Schemes",
      description: "Discover benefits and check eligibility.",
      icon: Landmark,
      color: "blue",
    },
    {
      title: "Rights & Laws",
      description: "Understand your rights in simple words.",
      icon: Scale,
      color: "purple",
    },
    {
      title: "Scholarships",
      description: "Find educational support and opportunities.",
      icon: GraduationCap,
      color: "cyan",
    },
    {
      title: "Banking Services",
      description: "Understand banking rules and services.",
      icon: CreditCard,
      color: "orange",
    },
  ];

  const suggestions = [
    "What government schemes are available for students?",
    "Explain my fundamental rights in simple language.",
    "How can I apply for a government scholarship?",
  ];

  
  const sendQuestion = async (value = question) => {
    if (!value.trim() || loading || loadingHistory) return;

    const userQuestion = value.trim();

    setQuestion("");
    setApiError("");
    setLoading(true);

    
    stop();

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userQuestion,
      },
    ]);

    try {
      let currentChatId = chatId;

      
      if (!currentChatId) {
        const newChat = await createChat(
          activeChat?.category || "General"
        );

        currentChatId = newChat._id;
        setChatId(currentChatId);
      }

      
      const result = await askAI(
        currentChatId,
        userQuestion,
        voiceLanguage
      );

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content: result.answer,
          language: voiceLanguage,
        },
      ]);
    } catch (err) {
      console.error("Chat error:", err);

      setApiError(
        err.message || "Something went wrong. Please try again."
      );

      setMessages((previous) => previous.slice(0, -1));
    } finally {
      setLoading(false);
    }
  };
  
  const handleCategory = (title) => {
    setQuestion(`Explain ${title} in simple language.`);
  };

  
  const startNewChat = () => {
    stop();

    setChatId(null);
    setMessages([]);
    setQuestion("");
    setApiError("");
  };

  return (
    <div className="home-container">

      {/* Loading previous conversation */}
      {loadingHistory ? (
        <div className="conversation-placeholder">
          <LoaderCircle
            size={28}
            className="loading-icon"
          />

          <h3>Loading your conversation...</h3>
          <p>Retrieving your saved messages.</p>
        </div>

      ) : messages.length === 0 ? (

        
        <div className="welcome-content">

          <div className="welcome-badge">
            <Sparkles size={14} />
            <span>YOUR PERSONAL GOVERNMENT AI ASSISTANT</span>
          </div>

          <div className="welcome-heading">
            <h1>
              Government knowledge,
              <br />
              <span>made simple for everyone.</span>
            </h1>

            <p>
              Understand government schemes, your rights and
              public services in your own language.
            </p>
          </div>

          <div className="trust-note">
            <ShieldCheck size={16} />
            Simplifying public information for everyone
          </div>

          <div className="category-grid">
            {categories.map((category) => {
              const Icon = category.icon;

              return (
                <button
                  key={category.title}
                  className="category-card"
                  onClick={() => handleCategory(category.title)}
                >
                  <div className={`category-icon ${category.color}`}>
                    <Icon size={22} />
                  </div>

                  <h3>{category.title}</h3>
                  <p>{category.description}</p>
                </button>
              );
            })}
          </div>

          <div className="suggestions">
            <p>TRY ASKING</p>

            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setQuestion(suggestion)}
              >
                <FileText size={15} />
                {suggestion}
              </button>
            ))}
          </div>

        </div>

      ) : (

        
        <div className="conversation-placeholder">

          {messages.map((message, index) => (
            <MessageBubble
              key={message._id || index}
              message={message}
              index={index}
              speakingId={speakingId}
              isPaused={isPaused}
              onPlay={play}
              onPause={pause}
              onResume={resume}
              onStop={stop}
              speechSupported={supported}
            />
          ))}

          {loading && (
            <div className="assistant-placeholder">
              <LoaderCircle
                size={22}
                className="loading-icon"
              />

              <div>
                <h3>NitiSathi is thinking...</h3>
                <p>Preparing your explanation.</p>
              </div>
            </div>
          )}

          {apiError && (
            <p className="voice-error">{apiError}</p>
          )}

          <button
            className="new-question-button"
            onClick={startNewChat}
          >
            + New Chat
          </button>

        </div>
      )}

      {/* Question input */}
      <div className="question-area">

        <select
          value={voiceLanguage}
          onChange={(e) => setVoiceLanguage(e.target.value)}
          className="voice-language"
        >
          <option value="en-IN">English</option>
          <option value="kn-IN">Kannada</option>
          <option value="hi-IN">Hindi</option>
          <option value="te-IN">Telugu</option>
          <option value="ta-IN">Tamil</option>
          <option value="mr-IN">Marathi</option>
        </select>

        <div className="question-box">

          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything about schemes, rights, laws..."
            rows={2}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendQuestion();
              }
            }}
          />

          <div className="question-actions">

            <span className="input-hint">
              <Mic size={14} />
              You can also ask using your voice
            </span>

            <div className="input-buttons">

              <button
                className={`mic-button ${isListening ? "listening" : ""}`}
                title="Voice search"
                aria-label={
                  isListening
                    ? "Stop voice search"
                    : "Start voice search"
                }
                onClick={
                  isListening ? stopListening : startListening
                }
              >
                <Mic size={19} />
              </button>

              <button
                className="send-button"
                onClick={() => sendQuestion()}
                disabled={
                  !question.trim() || loading || loadingHistory
                }
                aria-label="Send question"
              >
                <ArrowUp size={20} />
              </button>

            </div>
          </div>
        </div>

        {isListening && (
          <p className="voice-status">
            <span className="voice-dot"></span>
            Listening... Speak your question.
          </p>
        )}

        {error && (
          <p className="voice-error">{error}</p>
        )}

        {apiError && messages.length === 0 && !loadingHistory && (
          <p className="voice-error">{apiError}</p>
        )}

        <p className="privacy-note">
          <ShieldCheck size={13} />
          AI-generated explanations. Always verify important
          information with official sources.
        </p>

      </div>
    </div>
  );
}

export default Home;


