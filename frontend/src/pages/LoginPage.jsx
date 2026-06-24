import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser, guestLogin } from "../api/auth.js";
import { X, AlertTriangle, LucideComputer } from "lucide-react";
import "../styles/brutalism.css";
import "../styles/login.css"; 

export default function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  
  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const response = await loginUser({ username, password });
      if (response.success) {
        navigate("/notes");
      }
    } catch (error) {
      console.log("Login Error:", error);
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    try {
      const response = await guestLogin();
      if (response.success) {
        navigate("/notes");
      }
    } catch (error) {
      console.log("Guest Login Error:", error);
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Background Pattern */}
      <div className="bg-pattern brutal-bg-overlay" />

      <main className="auth-container">
        <div className="auth-card brutal-shadow-lg">
          
          <header className="auth-header">
            <h1 className="auth-title">INK & IRON</h1>
            <p className="auth-subtitle">Access your creator workspace</p>
          </header>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="input-label">Username</label>
              <input
                className="input-field"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <div className="password-header">
                <label className="input-label">Password</label>
                <button
                  type="button"
                  className="forgot-btn"
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot?
                </button>
              </div>
              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              className="primary-button login-btn brutal-shadow brutal-shadow-hover"
              disabled={isLoggingIn || isGuestLoading}
            >
              {isLoggingIn ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="auth-divider">
            <span>OR</span>
          </div>

          {/* THE GUEST DEMO TRIGGER */}
          <button 
            type="button" 
            className="primary-button guest-btn brutal-shadow brutal-shadow-hover"
            onClick={handleGuestLogin}
            disabled={isLoggingIn || isGuestLoading}
          >
            {isGuestLoading ? "Forging Sandbox..." : "Try Guest Demo"}
          </button>

          <div className="register-user">
            <p>
              New to the workspace?
              <Link to="/users/register" className="auth-link">
                Register an account
              </Link>
            </p>
          </div>
        </div>
      </main>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <div className="forgot-backdrop" onClick={() => setShowForgotModal(false)}>
          <div className="forgot-modal brutal-shadow-lg" onClick={(e) => e.stopPropagation()}>
            <div className="forgot-header">
              <div className="forgot-title-group">
                <AlertTriangle size={28} strokeWidth={2.5} />
                <h2>Under Construction</h2>
              </div>
              <button className="forgot-close-btn" onClick={() => setShowForgotModal(false)}>
                <X size={24} strokeWidth={3} />
              </button>
            </div>
            
            <div className="forgot-content">
              <p>
                The automated password recovery system is currently being forged in the backend. 
              </p>
              <p>
                For now, you can either create a new account or yell at the admin on GitHub to manually reset it for you.
              </p>
            </div>

            <div className="forgot-actions">
              <Link to="/users/register" className="forgot-action-btn new-acc-btn brutal-shadow-hover">
                Create New Account
              </Link>
              <a href="https://github.com/Aaditya-13" target="_blank" rel="noreferrer" className="forgot-action-btn github-btn brutal-shadow-hover">
                <LucideComputer size={20} /> Contact Admin 
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}