
import { useState } from "react";

import {
  Sparkles,
  Mail,
  Lock,
  User,
  Eye,
  EyeOff,
} from "lucide-react";

import {
  loginUser,
  registerUser,
  guestLogin,
} from "../services/api";

import "../styles/auth.css";

function Auth({ onAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // LOGIN AND REGISTER
  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    try {
      setLoading(true);

      const result = isLogin
        ? await loginUser(email, password)
        : await registerUser(name, email, password);

      onAuthSuccess(result.user);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  // GUEST LOGIN
  const handleGuestLogin = async () => {
    setError("");

    try {
      setLoading(true);

      const result = await guestLogin();

      onAuthSuccess(result.user);
    } catch (err) {
      setError(err.message || "Unable to continue as guest.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">

        {/* BRAND */}
        <div className="auth-brand">
          <div className="auth-logo">
            <Sparkles size={25} />
          </div>

          <h1>NitiSathi AI</h1>
          <p>Your guide to government services</p>
        </div>

        {/* HEADING */}
        <div className="auth-heading">
          <h2>
            {isLogin ? "Welcome back!" : "Create your account"}
          </h2>

          <p>
            {isLogin
              ? "Login to access your conversations."
              : "Join NitiSathi and stay informed."}
          </p>
        </div>

        {/* LOGIN / REGISTER FORM */}
        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <div className="auth-input-group">
              <label>Full name</label>

              <div className="auth-input-wrapper">
                <User size={18} />

                <input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
          )}

          <div className="auth-input-group">
            <label>Email address</label>

            <div className="auth-input-wrapper">
              <Mail size={18} />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="auth-input-group">
            <label>Password</label>

            <div className="auth-input-wrapper">
              <Lock size={18} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
              />

              <button
                type="button"
                className="auth-password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {error && (
            <div className="auth-error">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Login"
                : "Create Account"}
          </button>
        </form>

        {/* DIVIDER */}
        <div className="auth-divider">
          <span>OR</span>
        </div>

        {/* GUEST LOGIN */}
        <button
          type="button"
          className="guest-login-button"
          onClick={handleGuestLogin}
          disabled={loading}
        >
          {loading ? "Please wait..." : "Continue as Guest"}
        </button>

        {/* SWITCH LOGIN / REGISTER */}
        <div className="auth-switch">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError("");
            }}
            disabled={loading}
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </div>

        {/* FOOTER */}
        <div className="auth-footer">
          Knowledge for Everyone. Understand. Empower. Access.
        </div>

      </div>
    </div>
  );
}

export default Auth;
