import { useState } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import AssignmentsPage from "./pages/AssignmentsPage";
import CoursesPage from "./pages/CoursesPage";
import LecturerDashboardPage from "./pages/LecturerDashboardPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SubmitAssignmentPage from "./pages/SubmitAssignmentPage";

const USER_STORAGE_KEY = "edusubmit_user";

function getStoredUser() {
  const savedUser = localStorage.getItem(USER_STORAGE_KEY);
  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(getStoredUser());

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(loggedInUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  const isAuthenticated = Boolean(user);
  const isLecturer = user?.role === "LECTURER";

  return (
    <div className="app-shell">
      <NavBar user={user} onLogout={handleLogout} />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Navigate to={isAuthenticated ? "/courses" : "/login"} replace />} />
          <Route
            path="/login"
            element={isAuthenticated ? <Navigate to="/courses" replace /> : <LoginPage onLogin={handleLogin} />}
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/courses" replace /> : <RegisterPage />}
          />
          <Route
            path="/courses"
            element={isAuthenticated ? <CoursesPage user={user} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/assignments"
            element={isAuthenticated ? <AssignmentsPage user={user} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/submit"
            element={isAuthenticated ? <SubmitAssignmentPage user={user} /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated && isLecturer ? <LecturerDashboardPage /> : <Navigate to="/courses" replace />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}
