import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import NotesPage from "./pages/NotesPage.jsx";

function App() {

  const isLoggedIn = false; // later from backend/auth state

  return (
    <Routes>

      <Route
        path="/"
        element={
          isLoggedIn
            ? <Navigate to="/notes" />
            : <Navigate to="/users/login" />
        }
      />

      <Route
        path="/users/login"
        element={<LoginPage />}
      />

      <Route
        path="/users/register"
        element={<RegisterPage />}
      />

      <Route
        path="/notes"
        element={<NotesPage />}
      />

    </Routes>
  );
}

export default App