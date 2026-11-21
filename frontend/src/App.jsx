
import { useState } from "react";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Home from "./pages/Home";
import Auth from "./components/Auth";

import {
  getToken,
  getCurrentUser,
  logoutUser,
} from "./services/api";

import "./styles/global.css";
import "./styles/sidebar.css";

function App() {
  const [user, setUser] = useState(() => {
    try {
      return getToken() ? getCurrentUser() : null;
    } catch {
      return null;
    }
  });

  const [darkMode, setDarkMode] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(
    window.innerWidth > 768
  );
  const [activeChat, setActiveChat] = useState(null);

  const createNewChat = () => {
    setActiveChat(null);
  };

  const handleLogout = () => {
  logoutUser();
  setUser(null);
  setActiveChat(null);
};

  // Show login/register when user is not authenticated
  if (!user) {
    return (
      <Auth
        onAuthSuccess={(loggedInUser) => {
          setUser(loggedInUser);
        }}
      />
    );
  }

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <Sidebar
        isOpen={sidebarOpen}
        onNewChat={createNewChat}
        activeChat={activeChat}
        setActiveChat={setActiveChat}
        onClose={() => setSidebarOpen(false)}
      />

      {sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="main-content">
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          user={user}
          onLogout={handleLogout}
        />

        <Home activeChat={activeChat} />
      </main>
    </div>
  );
}

export default App;
