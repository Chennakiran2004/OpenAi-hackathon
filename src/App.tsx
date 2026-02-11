import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  clearAccessToken,
  getAccessToken,
  getErrorMessage,
  getProfile,
  getStoredRole,
  setAccessToken,
  setStoredRole,
  signin as apiSignin,
  signup as apiSignup,
} from "./api/clientapi";
import type { SignupPayload } from "./api/types";
import AuthPage from "./components/AuthPage";
import LandingPage from "./components/LandingPage";
import ProfilePage from "./components/ProfilePage";
import RecruiterHome from "./components/RecruiterHome";
import StudentHome from "./components/StudentHome";
import HomeNavbar from "./components/HomeNavbar";
import TopBar from "./components/TopBar";
import {
  createRecommendations,
  aggregateImpacts,
} from "./components/recommendationUtils";
import {
  AuthMode,
  ProcessingStatus,
  Recommendation,
  Role,
  User,
  View,
  WeightConfig,
  ImpactSummary,
} from "./components/types";
import { appStyles as styles } from "./stylecomponent";

function profileToUser(
  profile: { username: string; email: string },
  role: Role,
): User {
  return { name: profile.username, email: profile.email, role };
}

function App() {
  const [view, setView] = useState<View>("landing");
  const [authMode, setAuthMode] = useState<AuthMode>("signin");
  const [roleChoice, setRoleChoice] = useState<Role>("state_officer");
  const [user, setUser] = useState<User | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [stateField, setStateField] = useState("");
  const [department, setDepartment] = useState("");
  const [note, setNote] = useState("");
  const [authError, setAuthError] = useState<string | null>(null);

  const [quantity, setQuantity] = useState(10);
  const [crop, setCrop] = useState("tomato");
  const [urgency, setUrgency] = useState("Standard");
  const [deliveryWindow, setDeliveryWindow] = useState("3-5 days");
  const [priceCap, setPriceCap] = useState("");
  const [climateMode, setClimateMode] = useState(false);

  const [weights, setWeights] = useState<WeightConfig>({
    cost: 50,
    time: 25,
    carbon: 25,
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [impacts, setImpacts] = useState<ImpactSummary | null>(null);
  const [status, setStatus] = useState<ProcessingStatus>("idle");
  const [processed, setProcessed] = useState(0);
  const progress = useMemo(
    () =>
      status === "running" || status === "done" ? Math.min(100, processed) : 0,
    [status, processed],
  );

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    getProfile()
      .then((profile) => {
        const role = getStoredRole() || "state_officer";
        setUser(profileToUser(profile, role));
        setView("home");
      })
      .catch(() => {
        clearAccessToken();
      });
  }, []);

  const openAuth = useCallback((mode: AuthMode, role?: Role) => {
    if (role) setRoleChoice(role);
    setAuthMode(mode);
    setAuthError(null);
    setView("auth");
  }, []);

  const submitAuth = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setAuthError(null);
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (authMode === "signin") {
        try {
          const { access } = await apiSignin(trimmedEmail, trimmedPassword);
          setAccessToken(access);
          setStoredRole(roleChoice);
          const profile = await getProfile();
          setUser(profileToUser(profile, roleChoice));
          setView("home");
        } catch (err) {
          setAuthError(getErrorMessage(err));
        }
        return;
      }

      if (authMode === "signup") {
        if (trimmedPassword !== confirmPassword.trim()) {
          setAuthError("Passwords do not match.");
          return;
        }
        const payload: SignupPayload = {
          email: trimmedEmail,
          password: trimmedPassword,
          confirm_password: confirmPassword.trim(),
          username: name.trim() || trimmedEmail.split("@")[0] || "user",
          phone_number: phoneNumber.trim(),
          state: stateField.trim(),
          department: department.trim(),
          note: note.trim(),
        };
        try {
          const { access } = await apiSignup(payload);
          setAccessToken(access);
          setStoredRole(roleChoice);
          const profile = await getProfile();
          setUser(profileToUser(profile, roleChoice));
          setView("home");
        } catch (err) {
          setAuthError(getErrorMessage(err));
        }
      }
    },
    [
      authMode,
      email,
      password,
      confirmPassword,
      name,
      phoneNumber,
      stateField,
      department,
      note,
      roleChoice,
    ],
  );

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setPhoneNumber("");
    setStateField("");
    setDepartment("");
    setNote("");
    setView("landing");
  }, []);

  const runOptimizationDemo = () => {
    setStatus("running");
    setProcessed(0);
    setTimeout(() => {
      setProcessed(60);
    }, 250);
    setTimeout(() => {
      const recs = createRecommendations({ crop, quantity, weights });
      setRecommendations(recs);
      setImpacts(aggregateImpacts(recs));
      setProcessed(100);
      setStatus("done");
    }, 800);
  };

  const showHomeNav = view === "home" || view === "profile";

  return (
    <>
      {showHomeNav ? (
        <HomeNavbar
          onBrandClick={() => setView("home")}
          onProfileClick={() => setView("profile")}
          onLogout={logout}
        />
      ) : (
        <TopBar
          isLoggedIn={Boolean(user)}
          onBrandClick={() => setView(user ? "home" : "landing")}
          onSignIn={() => openAuth("signin")}
          onSignUp={() => openAuth("signup")}
          onLogout={logout}
        />
      )}

      <main className={`${styles.container} ${styles.main}`}>
        {view === "landing" && (
          <LandingPage
            onRequestDemo={() => openAuth("signup", "state_officer")}
            onViewSandbox={() => openAuth("signup", "central_admin")}
            onSignIn={() => openAuth("signin")}
          />
        )}

        {view === "auth" && (
          <AuthPage
            authMode={authMode}
            roleChoice={roleChoice}
            name={name}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            phoneNumber={phoneNumber}
            state={stateField}
            department={department}
            note={note}
            authError={authError}
            onSetRoleChoice={setRoleChoice}
            onSetName={setName}
            onSetEmail={setEmail}
            onSetPassword={setPassword}
            onSetConfirmPassword={setConfirmPassword}
            onSetPhoneNumber={setPhoneNumber}
            onSetState={setStateField}
            onSetDepartment={setDepartment}
            onSetNote={setNote}
            onSwitchMode={() => {
              setAuthMode(authMode === "signin" ? "signup" : "signin");
              setAuthError(null);
            }}
            onSubmit={submitAuth}
          />
        )}

        {view === "home" && user?.role === "central_admin" && (
          <StudentHome
            name={user.name}
            impacts={impacts}
            recommendations={recommendations}
          />
        )}

        {view === "home" && user?.role === "state_officer" && (
          <RecruiterHome
            name={user.name}
            crop={crop}
            quantity={quantity}
            urgency={urgency}
            deliveryWindow={deliveryWindow}
            priceCap={priceCap}
            climateMode={climateMode}
            weights={weights}
            recommendations={recommendations}
            impacts={impacts}
            status={status}
            progress={progress}
            onSetCrop={setCrop}
            onSetQuantity={setQuantity}
            onSetUrgency={setUrgency}
            onSetDeliveryWindow={setDeliveryWindow}
            onSetPriceCap={setPriceCap}
            onToggleClimateMode={setClimateMode}
            onSetWeights={setWeights}
            onRunOptimization={runOptimizationDemo}
          />
        )}

        {view === "profile" && user && (
          <ProfilePage
            user={user}
            onUpdateProfile={({ name: newName, email: newEmail }) =>
              setUser((u) =>
                u ? { ...u, name: newName, email: newEmail } : null,
              )
            }
            onBackToHome={() => setView("home")}
          />
        )}
      </main>
    </>
  );
}

export default App;
