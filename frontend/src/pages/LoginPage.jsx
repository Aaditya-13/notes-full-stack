import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../utility/AuthContext.jsx";
import { useToast } from "../utility/ToastContext.jsx";
import { AlertTriangle, LucideComputer } from "lucide-react";
import BrutalModal from "../components/BrutalModal.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login, loginAsGuest } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      showToast("Please enter both username and password.", "warning");
      return;
    }

    setIsLoggingIn(true);
    try {
      const response = await login({ username, password });
      if (response && response.success) {
        showToast("Authenticated successfully. Welcome back!", "success");
        navigate("/notes");
      } else {
        showToast(response?.message || "Invalid credentials.", "error");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Login failed. Please check your connection.";
      showToast(msg, "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleGuestLogin = async () => {
    setIsGuestLoading(true);
    try {
      const response = await loginAsGuest();
      if (response && response.success) {
        showToast("Logged in as guest. Entering sandbox...", "success");
        navigate("/notes");
      } else {
        showToast(response?.message || "Guest session failed.", "error");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Guest login failed.";
      showToast(msg, "error");
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-brutal-bg text-brutal-dark p-4 select-none bg-pattern">
      <main className="relative z-10 w-full max-w-md">
        <div className="bg-white border-4 border-brutal-dark p-8 md:p-12 brutal-shadow-lg flex flex-col">
          
          <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-2">
              INK & IRON
            </h1>
            <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Access your creator workspace
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-black uppercase tracking-wider">
                Username
              </label>
              <input
                className="w-full border-3 border-brutal-dark p-3 text-lg font-bold bg-gray-50 outline-none transition-all focus:bg-white focus:-translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_#7c3aed]"
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoggingIn || isGuestLoading}
              />
            </div>

            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-sm font-black uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  className="text-xs font-black uppercase tracking-wide text-brutal-purple underline hover:text-brutal-dark cursor-pointer"
                  onClick={() => setShowForgotModal(true)}
                  disabled={isLoggingIn || isGuestLoading}
                >
                  Forgot?
                </button>
              </div>
              <input
                className="w-full border-3 border-brutal-dark p-3 text-lg font-bold bg-gray-50 outline-none transition-all focus:bg-white focus:-translate-x-1 focus:-translate-y-1 focus:shadow-[4px_4px_0px_#7c3aed]"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoggingIn || isGuestLoading}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-brutal-purple text-white border-3 border-brutal-dark p-4 font-black uppercase tracking-widest cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1c1b1b] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
              disabled={isLoggingIn || isGuestLoading}
            >
              {isLoggingIn ? "Authenticating..." : "Sign In"}
            </button>
          </form>

          <div className="flex items-center text-center my-6 before:flex-1 before:border-b-3 before:border-brutal-dark after:flex-1 after:border-b-3 after:border-brutal-dark after:ml-4 before:mr-4 font-black text-sm tracking-widest">
            <span>OR</span>
          </div>

          <button
            type="button"
            className="w-full bg-brutal-yellow text-brutal-dark border-3 border-brutal-dark p-4 font-black uppercase tracking-widest cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1c1b1b] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
            onClick={handleGuestLogin}
            disabled={isLoggingIn || isGuestLoading}
          >
            {isGuestLoading ? "Forging Sandbox..." : "Try Guest Demo"}
          </button>

          <div className="text-center mt-8 font-bold text-sm text-gray-500">
            <span>New to the workspace?</span>
            <Link to="/users/register" className="text-brutal-purple underline ml-1 font-black hover:text-brutal-dark">
              Register an account
            </Link>
          </div>
        </div>
      </main>

      {/* FORGOT PASSWORD MODAL */}
      {showForgotModal && (
        <BrutalModal
          onClose={() => setShowForgotModal(false)}
          title="Under Construction"
          icon={<AlertTriangle className="text-brutal-danger" size={28} strokeWidth={3} />}
        >
          <div className="flex flex-col gap-4 font-bold text-gray-600">
            <p>
              The automated password recovery system is currently being forged in the backend.
            </p>
            <p>
              For now, you can either create a new account or reach out to the administrator on GitHub to manually reset it.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <Link
                to="/users/register"
                className="flex-1 bg-brutal-purple text-white border-3 border-brutal-dark p-3 font-black uppercase text-center text-sm brutal-shadow-hover"
                onClick={() => setShowForgotModal(false)}
              >
                Create New Account
              </Link>
              <a
                href="https://github.com/Aaditya-13"
                target="_blank"
                rel="noreferrer"
                className="flex-1 bg-white text-brutal-dark border-3 border-brutal-dark p-3 font-black uppercase text-center text-sm flex items-center justify-center gap-2 brutal-shadow-hover"
              >
                <LucideComputer size={18} strokeWidth={2.5} /> Contact Admin
              </a>
            </div>
          </div>
        </BrutalModal>
      )}
    </div>
  );
}