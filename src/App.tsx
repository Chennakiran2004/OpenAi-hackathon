import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { getAccessToken, getStoredRole, getStoredUser, clearAccessToken } from "./api/clientapi";
import { AuthProvider, useAuth, storedUserToUser } from "./contexts/AuthContext";
import { RecruiterProvider } from "./contexts/RecruiterContext";
import AuthPage from "./components/AuthPage";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/ProfilePage";
import RecruiterHome from "./components/RecruiterHome";
import StudentHome from "./components/StudentHome";
import HomeNavbar from "./components/HomeNavbar";
import TopBar from "./components/TopBar";
import { appStyles as styles } from "./stylecomponent";

function SessionRestore() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    const stored = getStoredUser();
    if (!stored) {
      clearAccessToken();
      return;
    }
    const role = getStoredRole() || "state_officer";
    setUser(storedUserToUser(stored, role));
    navigate("/home", { replace: true });
  }, [navigate, setUser]);
  return null;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, logout } = useAuth();
  const showHomeNav = location.pathname === "/home" || location.pathname === "/profile";

  return (
    <>
      {showHomeNav ? (
        <HomeNavbar
          onBrandClick={() => navigate("/home")}
          onProfileClick={() => navigate("/profile")}
          onLogout={logout}
        />
      ) : (
        <TopBar
          isLoggedIn={Boolean(user)}
          onBrandClick={() => navigate(user ? "/home" : "/")}
          onSignIn={() => navigate("/auth")}
          onSignUp={() => navigate("/auth?mode=signup")}
          onLogout={logout}
        />
      )}
      <main className={`${styles.container} ${styles.main}`}>
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                onRequestDemo={() => navigate("/auth?mode=signup&role=state_officer")}
                onViewSandbox={() => navigate("/auth?mode=signup&role=central_admin")}
                onSignIn={() => navigate("/auth")}
              />
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/home"
            element={
              !user ? (
                <Navigate to="/" replace />
              ) : user.role === "central_admin" ? (
                <StudentHome />
              ) : (
                <RecruiterHome />
              )
            }
          />
          <Route
            path="/profile"
            element={
              !user ? (
                <Navigate to="/" replace />
              ) : (
                <ProfilePage
                  user={user}
                  onUpdateProfile={({ name: newName, email: newEmail }) =>
                    setUser((u) => (u ? { ...u, name: newName, email: newEmail } : null))
                  }
                  onBackToHome={() => navigate("/home")}
                />
              )
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <RecruiterProvider>
        <SessionRestore />
        <AppContent />
      </RecruiterProvider>
    </AuthProvider>
  );
}

export default App;
