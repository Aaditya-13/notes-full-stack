import { Link, useNavigate } from "react-router-dom";
import "../styles/brutalism.css"
import "../styles/components.css"
import { useState } from "react";
import { loginUser } from "../api/auth.js";

export default function LoginPage() {

  const navigate = useNavigate()

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const updateUsername = (e) => {
    setUsername(e.target.value)
  }

  const updatePassword = (e) => {
    setPassword(e.target.value)
  }


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({
        username: username,
        password: password
      })

      if(response.success){
        navigate("/notes")
      }
      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="auth-page">

      <div className="absolute inset-0 bg-pattern opacity-40 pointer-events-none" />

      <main className="relative z-10 w-full max-w-120">

        <div className="auth-card brutal-shadow-lg">

          <header className="auth-header">

            <h1 className="auth-title">
              Ink & Iron
            </h1>

            <p className="auth-subtitle">
              Access your creator workspace
            </p>

          </header>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-6"
          >

            <div className="form-group">

              <label className="input-label">
                Username
              </label>

              <input
                className="input-field"
                type="text"
                placeholder="Username"
                value={username}
                onChange={updateUsername}
              />

            </div>

            <div className="form-group">

              <div className="password-field">

                <label className="input-label">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-btn"
                >
                  Forgot?
                </button>

              </div>

              <input
                className="input-field"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={updatePassword}
              />

            </div>

            <button
              type="submit"
              className="
                primary-button
                brutal-shadow
                brutal-shadow-hover
                brutal-shadow-active
              "
            >
              Sign In
            </button>

          </form>

          <div className="register-user">

            <p>

              New to the workspace?

              <Link
                to="/users/register"
                className="auth-link"
              >
                Register an account
              </Link>

            </p>

          </div>

        </div>

      </main>

    </div>
  );
}