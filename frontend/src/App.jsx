import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import NotesPage from "./pages/NotesPage.jsx";
import { useAuth } from "./utility/AuthContext.jsx";

// Initial Loading screen for session check
function InitialLoadingScreen() {
  return (
    <div className="min-h-screen bg-brutal-bg flex items-center justify-center bg-pattern">
      <div className="text-2xl font-black uppercase border-4 border-brutal-dark p-6 bg-brutal-yellow brutal-shadow-lg animate-pulse tracking-wider">
        Forging Workspace...
      </div>
    </div>
  );
}

// Guard workspace from anonymous traffic
function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <InitialLoadingScreen />;
  }

  return isLoggedIn ? children : <Navigate to="/users/login" replace />;
}

// Redirect authenticated users back to notes workspace
function PublicRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <InitialLoadingScreen />;
  }

  return !isLoggedIn ? children : <Navigate to="/notes" replace />;
}

function App() {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return <InitialLoadingScreen />;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn
            ? <Navigate to="/notes" replace />
            : <Navigate to="/users/login" replace />
        }
      />

      <Route
        path="/users/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />

      <Route
        path="/users/register"
        element={
          <PublicRoute>
            <RegisterPage />
          </PublicRoute>
        }
      />

      <Route
        path="/notes"
        element={
          <ProtectedRoute>
            <NotesPage />
          </ProtectedRoute>
        }
      />

      {/* Fallback routing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;