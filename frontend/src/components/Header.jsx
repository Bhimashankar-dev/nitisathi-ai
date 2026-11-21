
import {
  Menu,
  Sun,
  Moon,
  Globe,
  ChevronDown,
  ShieldCheck,
  LogOut,
  UserRound,
} from "lucide-react";

function Header({
  darkMode,
  setDarkMode,
  toggleSidebar,
  user,
  onLogout,
}) {
  return (
    <header className="header">
      <div className="header-left">
        <button
          className="header-icon"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <Menu size={21} />
        </button>

        <div className="header-title">
          <span className="header-status"></span>
          <span>NitiSathi AI</span>
          <span className="header-version">BETA</span>
        </div>
      </div>

      <div className="header-right">
        <div className="language-selector">
          <Globe size={17} />
          <select defaultValue="English" aria-label="Interface language">
            <option>English</option>
            <option>ಕನ್ನಡ</option>
            <option>हिन्दी</option>
            <option>తెలుగు</option>
            <option>தமிழ்</option>
            <option>मराठी</option>
            <option>বাংলা</option>
          </select>
          <ChevronDown size={14} />
        </div>

        <button
          className="header-icon theme-button"
          onClick={() => setDarkMode(!darkMode)}
          aria-label="Toggle theme"
        >
          {darkMode ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <div className="header-trust">
          <ShieldCheck size={17} />
          <span>Public Information</span>
        </div>

        <div className="header-user">
         <UserRound size={17} />
          <span>
           {user?.role === "guest"
            ? "Guest User"
         : user?.name || "User"}
          </span>
        </div>

        <button
          className="header-icon logout-button"
          onClick={onLogout}
          title="Logout"
          aria-label="Logout"
        >
          <LogOut size={19} />
        </button>
      </div>
    </header>
  );
}

export default Header;

