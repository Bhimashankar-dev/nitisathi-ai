
import {
  Volume2,
  Play,
  Pause,
  Square,
  User,
  Sparkles,
} from "lucide-react";

function MessageBubble({
  message,
  index,
  speakingId,
  isPaused,
  onPlay,
  onPause,
  onResume,
  onStop,
  speechSupported,
}) {
  const isUser = message.role === "user";
  const messageId = message._id || index;
  const isSpeaking = speakingId === messageId;

  return (
    <div className={`message-row ${isUser ? "user-row" : "assistant-row"}`}>
      <div className="message-avatar">
        {isUser ? <User size={17} /> : <Sparkles size={17} />}
      </div>

      <div className="message-content">
        <div className="message-author">
          {isUser ? "You" : "NitiSathi AI"}
        </div>

        <div className="message-text">
          {message.content}
        </div>

        {!isUser && speechSupported && (
          <div className="message-voice-controls">
            {!isSpeaking ? (
              <button
                onClick={() =>
                  onPlay(message.content, message.language, messageId)
                }
                title="Listen to response"
              >
                <Volume2 size={16} />
                <span>Listen</span>
              </button>
            ) : (
              <>
                {!isPaused ? (
                  <button onClick={onPause} title="Pause">
                    <Pause size={16} />
                    <span>Pause</span>
                  </button>
                ) : (
                  <button onClick={onResume} title="Resume">
                    <Play size={16} />
                    <span>Resume</span>
                  </button>
                )}

                <button onClick={onStop} title="Stop">
                  <Square size={15} />
                  <span>Stop</span>
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default MessageBubble;
