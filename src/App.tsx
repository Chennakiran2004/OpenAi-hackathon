import React, { useEffect } from "react";
import {
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import {
  getAccessToken,
  getStoredRole,
  getStoredSector,
  getStoredUser,
  clearAccessToken,
} from "./api/clientapi";
import {
  AuthProvider,
  useAuth,
  storedUserToUser,
} from "./contexts/AuthContext";
import { RecruiterProvider } from "./contexts/RecruiterContext";
import AuthPage from "./components/AuthPage";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/ProfilePage";
import Dashboard from "./components/Dashboard";
import OptimizeForm from "./components/OptimizeForm";
import OptimizationResults from "./components/OptimizationResults";
import QueryHistory from "./components/QueryHistory";
import ImpactDashboard from "./components/ImpactDashboard";
import DemandPrediction from "./components/DemandPrediction";
import PetroleumSector from "./components/PetroleumSector";
import SectorSelect from "./components/SectorSelect";
import TopBar from "./components/TopBar";
import type { VoiceAgentSector } from "./api/types";
import AssistLauncher from "./components/AssistLauncher";
import { appStyles as styles } from "./stylecomponent";
import { Toaster } from 'react-hot-toast';

function getDefaultPrivateRoute(): string {
  const sector = getStoredSector();
  if (sector === "petroleum") return "/petroleum/dashboard";
  if (sector === "agriculture") return "/dashboard";
  return "/choose-sector";
}

function SessionRestore() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser, setSessionRestored } = useAuth();

  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setSessionRestored(true);
      return;
    }
    const stored = getStoredUser();
    if (!stored) {
      clearAccessToken();
      setSessionRestored(true);
      return;
    }
    const role = getStoredRole() || "state_officer";
    setUser(storedUserToUser(stored, role));
    setSessionRestored(true);

    // Only redirect to /dashboard if user is on a public page (e.g., / or /auth)
    // Don't redirect if they're already on a protected route like /profile or /dashboard
    const isPublicPage =
      location.pathname === "/" || location.pathname === "/auth";
    if (isPublicPage) {
      navigate(getDefaultPrivateRoute(), { replace: true });
    }
  }, [navigate, setUser, setSessionRestored, location.pathname]);
  return null;
}

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser, logout, sessionRestored } = useAuth();

  // Only show TopBar on public pages (landing and auth)
  const showTopBar = location.pathname === "/" || location.pathname === "/auth";

  // Show loading while session is being restored
  if (!sessionRestored) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {showTopBar && (
        <TopBar
          isLoggedIn={Boolean(user)}
          onBrandClick={() => navigate(user ? getDefaultPrivateRoute() : "/")}
          onSignIn={() => navigate("/auth")}
          onSignUp={() => navigate("/auth?mode=signup")}
          onLogout={logout}
        />
      )}
      <main className={showTopBar ? `${styles.container} ${styles.main}` : ""}>
        <Routes>
          <Route
            path="/"
            element={
              <LandingPage
                onRequestDemo={() =>
                  navigate("/auth?mode=signup&role=state_officer")
                }
                onViewSandbox={() =>
                  navigate("/auth?mode=signup&role=central_admin")
                }
                onSignIn={() => navigate("/auth")}
              />
            }
          />
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/choose-sector"
            element={!user ? <Navigate to="/" replace /> : <SectorSelect />}
          />
          <Route
            path="/dashboard"
            element={!user ? <Navigate to="/" replace /> : <Dashboard />}
          />
          <Route
            path="/optimize"
            element={!user ? <Navigate to="/" replace /> : <OptimizeForm />}
          />
          <Route
            path="/results/:id"
            element={
              !user ? <Navigate to="/" replace /> : <OptimizationResults />
            }
          />
          <Route
            path="/history"
            element={!user ? <Navigate to="/" replace /> : <QueryHistory />}
          />
          <Route
            path="/predict"
            element={!user ? <Navigate to="/" replace /> : <DemandPrediction />}
          />
          <Route
            path="/impact"
            element={!user ? <Navigate to="/" replace /> : <ImpactDashboard />}
          />
          <Route
            path="/petroleum"
            element={
              !user ? <Navigate to="/" replace /> : <Navigate to="/petroleum/dashboard" replace />
            }
          />
          <Route
            path="/petroleum/:tab"
            element={!user ? <Navigate to="/" replace /> : <PetroleumSector />}
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
                    setUser((u) =>
                      u ? { ...u, name: newName, email: newEmail } : null,
                    )
                  }
                  onBackToHome={() => navigate(getDefaultPrivateRoute())}
                />
              )
            }
          />
          <Route
            path="*"
            element={
              <Navigate to={user ? getDefaultPrivateRoute() : "/"} replace />
            }
          />
        </Routes>
      </main>
      <AssistLauncherHost />
    </>
  );
}

const AGRICULTURE_ROUTES = new Set([
  "/dashboard",
  "/optimize",
  "/history",
  "/predict",
  "/impact",
]);

function getVoiceAgentSectorForPath(pathname: string): VoiceAgentSector | null {
  if (pathname.startsWith("/petroleum")) {
    return "petroleum";
  }
  if (pathname.startsWith("/results/")) {
    return "agriculture";
  }
  if (AGRICULTURE_ROUTES.has(pathname)) {
    return "agriculture";
  }
  return null;
}

function AssistLauncherHost() {
  const location = useLocation();
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  const sector = getVoiceAgentSectorForPath(location.pathname);
  if (!sector) {
    return null;
  }

  return <AssistLauncher sector={sector} />;
}

function App() {
  return (
    <AuthProvider>
      <RecruiterProvider>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            style: {
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
            },
          }}
        />
        <SessionRestore />
        <AppContent />
      </RecruiterProvider>
    </AuthProvider>
  );
}

export default App;
