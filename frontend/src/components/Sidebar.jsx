
import { useState, useEffect } from "react";

import {
  Plus,
  MessageSquare,
  Landmark,
  Scale,
  GraduationCap,
  CreditCard,
  Clock,
  PanelLeftClose,
  Sparkles,
  MoreHorizontal,
  Pencil,
  Trash2,
  X,
  Check,
} from "lucide-react";

import {
  getChats,
  renameChat,
  deleteChat,
} from "../services/api";

function Sidebar({
  isOpen,
  onNewChat,
  activeChat,
  setActiveChat,
  onClose,
}) {
  const [recentChats, setRecentChats] = useState([]);
  const [loadingChats, setLoadingChats] = useState(true);
  const [historyError, setHistoryError] = useState("");

  const [menuChatId, setMenuChatId] = useState(null);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [actionError, setActionError] = useState("");

  const [deletingChatId, setDeletingChatId] = useState(null);

  const categories = [
    { name: "Government Schemes", icon: Landmark },
    { name: "Rights & Laws", icon: Scale },
    { name: "Education & Scholarships", icon: GraduationCap },
    { name: "Banking Services", icon: CreditCard },
  ];

  const loadChats = async () => {
    try {
      setHistoryError("");
      const chats = await getChats();
      setRecentChats(chats);
    } catch (error) {
      console.error("History loading error:", error);
      setHistoryError("Unable to load chat history.");
    } finally {
      setLoadingChats(false);
    }
  };

  useEffect(() => {
    loadChats();
  }, []);

  const handleRename = async (chatId) => {
    if (!editTitle.trim()) {
      setActionError("Chat title cannot be empty.");
      return;
    }

    try {
      setActionError("");

      const updatedChat = await renameChat(chatId, editTitle);

      setRecentChats((previous) =>
        previous.map((chat) =>
          chat._id === chatId
            ? { ...chat, title: updatedChat.title }
            : chat
        )
      );

      if (activeChat?._id === chatId) {
        setActiveChat((previous) => ({
          ...previous,
          title: updatedChat.title,
        }));
      }

      setEditingChatId(null);
      setEditTitle("");
    } catch (error) {
      setActionError(error.message);
    }
  };

  const handleDelete = async (chatId) => {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this conversation?"
    );

    if (!confirmed) return;

    try {
      setActionError("");

      await deleteChat(chatId);

      setRecentChats((previous) =>
        previous.filter((chat) => chat._id !== chatId)
      );

      if (activeChat?._id === chatId) {
        setActiveChat(null);
        onNewChat();
      }

      setMenuChatId(null);
    } catch (error) {
      setActionError(error.message);
    }
  };

  if (!isOpen) return null;

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-top">
        <div className="brand">
          <div className="brand-icon">
            <Sparkles size={21} />
          </div>

          <div>
            <h2>NitiSathi</h2>
            <span>AI ASSISTANT</span>
          </div>
        </div>

        <button
         className="icon-button"
         onClick={onClose}
         title="Close sidebar"
        >
        <PanelLeftClose size={19} />
       </button>
      </div>

      <button
        className="new-chat-button"
        onClick={() => {
          setMenuChatId(null);
          onNewChat();
        }}
      >
        <Plus size={19} />
        <span>New Chat</span>
      </button>

      <div className="sidebar-section">
        <p className="section-label">EXPLORE CATEGORIES</p>

        {categories.map((category) => {
          const Icon = category.icon;

          return (
            <button
              className="sidebar-item"
              key={category.name}
              onClick={() => {
                onNewChat();
                setActiveChat({ category: category.name });
              }}
            >
              <Icon size={18} />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      <div className="sidebar-section recent-section">
        <p className="section-label">
          <Clock size={13} />
          RECENT CHATS
        </p>

        {actionError && (
          <p className="history-message">{actionError}</p>
        )}

        {loadingChats && (
          <p className="history-message">Loading conversations...</p>
        )}

        {historyError && (
          <p className="history-message">{historyError}</p>
        )}

        {!loadingChats &&
          !historyError &&
          recentChats.length === 0 && (
            <p className="history-message">
              No conversations yet.
            </p>
          )}

        {recentChats.map((chat) => (
          <div
            className={`recent-chat-wrapper ${
              activeChat?._id === chat._id ? "active" : ""
            }`}
            key={chat._id}
          >
            {editingChatId === chat._id ? (
              <div className="rename-chat-box">
                <input
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") handleRename(chat._id);
                    if (event.key === "Escape") setEditingChatId(null);
                  }}
                  autoFocus
                  maxLength={60}
                />

                <button
                  className="chat-action-button"
                  title="Save title"
                  onClick={() => handleRename(chat._id)}
                >
                  <Check size={16} />
                </button>
                <button
                  className="chat-action-button"
                  title="Cancel"
                  onClick={() => setEditingChatId(null)}
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <>
                <button
                  className={`sidebar-item recent-chat ${
                    activeChat?._id === chat._id ? "active" : ""
                  }`}
                  onClick={() => {
                    setMenuChatId(null);
                    setActiveChat(chat);
                  }}
                  title={chat.title}
                >
                  <MessageSquare size={16} />

                  <span>{chat.title || "New Chat"}</span>
                </button>

                <button
                  className="chat-menu-trigger"
                  title="Chat options"
                  onClick={() =>
                    setMenuChatId(
                      menuChatId === chat._id ? null : chat._id
                    )
                  }
                >
                  <MoreHorizontal size={18} />
                </button>

                {menuChatId === chat._id && (
                  <div className="chat-options-menu">
                    <button
                      onClick={() => {
                        setEditingChatId(chat._id);
                        setEditTitle(chat.title || "");
                        setMenuChatId(null);
                      }}
                    >
                      <Pencil size={15} />
                      Rename
                    </button>

                    <button
                      className="delete-chat-option"
                      onClick={() => handleDelete(chat._id)}
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="footer-icon">
          <Sparkles size={18} />
        </div>

        <div>
          <strong>Knowledge for Everyone</strong>
          <p>Understand. Empower. Access.</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;

