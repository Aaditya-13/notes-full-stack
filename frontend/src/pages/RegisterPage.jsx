import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../api/auth.js";
import "../styles/brutalism.css";
import "../styles/components.css";

export default function RegisterPage() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);

  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!acceptedTerms) {
      alert("Please accept Terms & Conditions");
      return;
    }
    const formData = new FormData()

    formData.append("username", username);
    formData.append("fullName", fullName);
    formData.append("email", email);
    formData.append("password", password);

    if (avatar) {
      formData.append("avatar", avatar);
    }

    try {
      const response = await registerUser(formData);

      if(response.success){
        navigate("/users/login")
      }

    } catch (error) {
      console.log(error);
    }

  };

  return (
    <div className="auth-page">

      <div className="absolute inset-0 bg-pattern opacity-40 pointer-events-none" />

      <main className="relative z-10 w-full max-w-150">

        <div className="auth-card register-card brutal-shadow-lg">

          <div className="new-badge">
            NEW
          </div>

          <header className="auth-header">

            <h1 className="auth-title">
              INK & IRON
            </h1>

            <p className="auth-subtitle">
              Forge your creative identity.
            </p>

          </header>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
          >

            {/* Avatar */}

            <div className="avatar-section">

              <label
                htmlFor="avatar"
                className="
                  avatar-circle
                  brutal-shadow
                "
              >

                {
                  avatar
                    ? (
                      <img
                        src={URL.createObjectURL(avatar)}
                        alt="avatar"
                        className="avatar-preview"
                      />
                    )
                    : "+"
                }

              </label>

              <input
                id="avatar"
                type="file"
                hidden
                accept="image/*"
                onChange={(e) =>
                  setAvatar(e.target.files[0])
                }
              />

              <span className="avatar-text">
                UPLOAD AVATAR
              </span>

            </div>

            {/* Full Name */}

            <div className="form-group">

              <label className="input-label">
                Full Name
              </label>

              <input
                className="input-field"
                type="text"
                value={fullName}
                onChange={(e) =>
                  setFullName(e.target.value)
                }
                placeholder="Jane Doe"
              />

            </div>

            {/* Username */}

            <div className="form-group">

              <label className="input-label">
                Username
              </label>

              <div className="username-wrapper">

                <div className="username-prefix">
                  @
                </div>

                <input
                  className="username-input"
                  type="text"
                  value={username}
                  onChange={(e) =>
                    setUsername(e.target.value)
                  }
                  placeholder="janedoe"
                />

              </div>

            </div>

            {/* Email */}

            <div className="form-group">

              <label className="input-label">
                Email Address
              </label>

              <input
                className="input-field"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="jane@example.com"
              />

            </div>

            {/* Password */}

            <div className="form-group">

              <label className="input-label">
                Password
              </label>

              <div className="password-wrapper">

                <input
                  className="password-input"
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="••••••••"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>

            {/* Terms */}

            <label className="terms-row">

              <input
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) =>
                  setAcceptedTerms(
                    e.target.checked
                  )
                }
              />

              <span>
                I agree to the{" "}
                <a href="#">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#">
                  Privacy Policy
                </a>
              </span>

            </label>

            {/* Submit */}

            <button
              type="submit"
              className="
                register-button
                brutal-shadow
                brutal-shadow-hover
                brutal-shadow-active
              "
            >
              CREATE ACCOUNT
            </button>

          </form>

          <div className="register-user">

            <p>

              Already have an account?{" "}

              <Link
                to="/users/login"
                className="auth-link"
              >
                Log In
              </Link>

            </p>

          </div>

        </div>

      </main>

    </div>
  );
}