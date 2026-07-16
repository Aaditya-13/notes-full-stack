import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../utility/AuthContext.jsx";
import { useToast } from "../utility/ToastContext.jsx";

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const { showToast } = useToast();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      showToast("Please accept the Terms & Conditions.", "warning");
      return;
    }

    if (!username.trim() || !fullName.trim() || !email.trim() || !password.trim()) {
      showToast("Please fill in all required fields.", "warning");
      return;
    }

    if (password.length < 6) {
      showToast("Password must be at least 6 characters.", "warning");
      return;
    }

    const formData = new FormData();
    formData.append("username", username.trim().toLowerCase());
    formData.append("fullName", fullName.trim());
    formData.append("email", email.trim());
    formData.append("password", password);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    setIsRegistering(true);
    try {
      const response = await register(formData);

      if (response && response.success) {
        showToast("Account forged successfully! Please sign in.", "success");
        navigate("/users/login");
      } else {
        showToast(response?.message || "Registration failed.", "error");
      }
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed. Try a different username/email.";
      showToast(msg, "error");
    } finally {
      setIsRegistering(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-brutal-bg text-brutal-dark p-4 select-none bg-pattern">
      <main className="relative z-10 w-full max-w-lg">
        <div className="bg-white border-4 border-brutal-dark p-8 md:p-10 brutal-shadow-lg relative flex flex-col">
          
          {/* Brutalist Badge */}
          <div className="absolute -top-4 -right-4 bg-brutal-purple text-white px-5 py-2.5 font-black text-sm border-3 border-brutal-dark rotate-3 brutal-shadow select-none">
            NEW
          </div>

          <header className="text-center mb-6">
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-1">
              INK & IRON
            </h1>
            <p className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Forge your creative identity
            </p>
          </header>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-2.5 mb-2">
              <label
                htmlFor="avatar"
                className="w-24 h-24 rounded-full border-3 border-brutal-dark bg-brutal-yellow flex items-center justify-center text-4xl font-light cursor-pointer overflow-hidden brutal-shadow hover:scale-105 active:scale-95 transition-all"
                title="Upload profile avatar"
              >
                {avatar ? (
                  <img
                    src={URL.createObjectURL(avatar)}
                    alt="avatar preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  "+"
                )}
              </label>

              <input
                id="avatar"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) => setAvatar(e.target.files[0])}
                disabled={isRegistering}
              />

              <span className="text-xs font-black uppercase tracking-wider text-gray-700">
                UPLOAD AVATAR
              </span>
            </div>

            {/* Full Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider">
                Full Name
              </label>
              <input
                className="w-full border-3 border-brutal-dark p-3 text-base font-bold bg-gray-50 outline-none transition-all focus:bg-white focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[3px_3px_0px_#7c3aed]"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Jane Doe"
                required
                disabled={isRegistering}
              />
            </div>

            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider">
                Username
              </label>
              <div className="flex border-3 border-brutal-dark bg-gray-50 focus-within:bg-white focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 focus-within:shadow-[3px_3px_0px_#7c3aed] transition-all">
                <div className="w-11 border-r-3 border-brutal-dark bg-gray-200 flex items-center justify-center font-black text-base select-none">
                  @
                </div>
                <input
                  className="flex-1 p-3 text-base font-bold outline-none bg-transparent"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="janedoe"
                  required
                  disabled={isRegistering}
                />
              </div>
            </div>

            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider">
                Email Address
              </label>
              <input
                className="w-full border-3 border-brutal-dark p-3 text-base font-bold bg-gray-50 outline-none transition-all focus:bg-white focus:-translate-x-0.5 focus:-translate-y-0.5 focus:shadow-[3px_3px_0px_#7c3aed]"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jane@example.com"
                required
                disabled={isRegistering}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-black uppercase tracking-wider">
                Password
              </label>
              <div className="flex border-3 border-brutal-dark bg-gray-50 focus-within:bg-white focus-within:-translate-x-0.5 focus-within:-translate-y-0.5 focus-within:shadow-[3px_3px_0px_#7c3aed] transition-all">
                <input
                  className="flex-1 p-3 text-base font-bold outline-none bg-transparent"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isRegistering}
                />
                <button
                  type="button"
                  className="w-14 border-l-3 border-brutal-dark bg-white font-black text-xs uppercase cursor-pointer hover:bg-gray-100 flex items-center justify-center transition-all select-none"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isRegistering}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {/* Terms and Conditions */}
            <label className="flex items-center gap-3 cursor-pointer select-none text-xs font-bold mt-2 text-gray-700">
              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="w-5 h-5 border-3 border-brutal-dark accent-brutal-dark cursor-pointer shrink-0"
                disabled={isRegistering}
              />
              <span>
                I agree to the{" "}
                <a href="#" className="font-black underline hover:text-black" onClick={(e) => e.preventDefault()}>
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="font-black underline hover:text-black" onClick={(e) => e.preventDefault()}>
                  Privacy Policy
                </a>
              </span>
            </label>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-brutal-yellow text-brutal-dark border-3 border-brutal-dark p-4 font-black uppercase tracking-widest cursor-pointer hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[5px_5px_0px_#1c1b1b] active:translate-x-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0px_#1c1b1b] transition-all disabled:opacity-75 disabled:cursor-not-allowed mt-4"
              disabled={isRegistering}
            >
              {isRegistering ? "Forging Account..." : "Create Account"}
            </button>
          </form>

          <div className="text-center mt-6 font-bold text-sm text-gray-500">
            <span>Already have an account?</span>
            <Link to="/users/login" className="text-brutal-purple underline ml-1 font-black hover:text-brutal-dark">
              Log In
            </Link>
          </div>

        </div>
      </main>
    </div>
  );
}