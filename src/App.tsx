import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  clearAccessToken,
  getAccessToken,
  getErrorMessage,
  getProfile,
  getStoredRole,
  setAccessToken,
  setStoredRole,
  signin as apiSignin,
  signup as apiSignup
} from './api/clientapi';
import type { SignupPayload } from './api/types';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import ProfilePage from './components/ProfilePage';
import RecruiterHome from './components/RecruiterHome';
import StudentHome from './components/StudentHome';
import HomeNavbar from './components/HomeNavbar';
import TopBar from './components/TopBar';
import { createCandidate } from './components/candidateUtils';
import { AuthMode, Candidate, ProcessingStatus, Role, User, View } from './components/types';
import { appStyles as styles } from './stylecomponent';

function profileToUser(profile: { username: string; email: string }, role: Role): User {
  return { name: profile.username, email: profile.email, role };
}

function App() {
  const [view, setView] = useState<View>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [roleChoice, setRoleChoice] = useState<Role>('student');
  const [user, setUser] = useState<User | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);

  const [bulkSize, setBulkSize] = useState(500);
  const [processed, setProcessed] = useState(0);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [blindMode, setBlindMode] = useState(false);
  const [ranked, setRanked] = useState<Candidate[]>([]);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const progress = bulkSize > 0 ? Math.min(100, Math.round((processed / bulkSize) * 100)) : 0;

  const elapsedMs = useMemo(() => {
    if (!startTime) {
      return 0;
    }
    if (endTime) {
      return endTime - startTime;
    }
    return Date.now() - startTime;
  }, [startTime, endTime]);

  const throughput = elapsedMs > 0 ? ((processed * 60000) / elapsedMs).toFixed(1) : '0.0';

  const etaSeconds = useMemo(() => {
    if (status !== 'running' || processed === 0) {
      return '--';
    }
    const ratePerMs = processed / elapsedMs;
    const left = Math.max(bulkSize - processed, 0);
    return Math.ceil(left / ratePerMs / 1000).toString();
  }, [status, processed, elapsedMs, bulkSize]);

  useEffect(() => {
    const token = getAccessToken();
    if (!token) return;
    getProfile()
      .then((profile) => {
        const role = getStoredRole() || 'student';
        setUser(profileToUser(profile, role));
        setView('home');
      })
      .catch(() => {
        clearAccessToken();
      });
  }, []);

  const openAuth = useCallback((mode: AuthMode, role?: Role) => {
    if (role) setRoleChoice(role);
    setAuthMode(mode);
    setAuthError(null);
    setView('auth');
  }, []);

  const submitAuth = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      setAuthError(null);
      const trimmedEmail = email.trim();
      const trimmedPassword = password.trim();

      if (authMode === 'signin') {
        try {
          const { access } = await apiSignin(trimmedEmail, trimmedPassword);
          setAccessToken(access);
          setStoredRole(roleChoice);
          const profile = await getProfile();
          setUser(profileToUser(profile, roleChoice));
          setView('home');
        } catch (err) {
          setAuthError(getErrorMessage(err));
        }
        return;
      }

      if (authMode === 'signup') {
        if (trimmedPassword !== confirmPassword.trim()) {
          setAuthError('Passwords do not match.');
          return;
        }
        const payload: SignupPayload = {
          email: trimmedEmail,
          password: trimmedPassword,
          confirm_password: confirmPassword.trim(),
          username: name.trim() || trimmedEmail.split('@')[0] || 'user',
          phone_number: phoneNumber.trim(),
          age: Number(age) || 0,
          gender: gender.trim() || 'Prefer not to say',
          address: address.trim()
        };
        try {
          const { access } = await apiSignup(payload);
          setAccessToken(access);
          setStoredRole(roleChoice);
          const profile = await getProfile();
          setUser(profileToUser(profile, roleChoice));
          setView('home');
        } catch (err) {
          setAuthError(getErrorMessage(err));
        }
      }
    },
    [authMode, email, password, confirmPassword, name, phoneNumber, age, gender, address, roleChoice]
  );

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
    setPhoneNumber('');
    setAge('');
    setGender('');
    setAddress('');
    setView('landing');
  }, []);

  const runRecruiterDemo = () => {
    const total = Math.max(100, Math.min(10000, bulkSize));
    setBulkSize(total);
    setStatus('running');
    setProcessed(0);
    setRanked([]);
    setStartTime(Date.now());
    setEndTime(null);

    const targetDuration = Math.max(9000, Math.min(25000, total * 18));
    const tickMs = 180;
    const step = total / (targetDuration / tickMs);

    let localProcessed = 0;
    const timer = window.setInterval(() => {
      localProcessed = Math.min(total, localProcessed + step + Math.random() * step * 0.2);
      const rounded = Math.floor(localProcessed);
      setProcessed(rounded);

      if (rounded >= total) {
        window.clearInterval(timer);
        const candidates = Array.from({ length: total }, (_, i) => createCandidate(i + 1))
          .sort((a, b) => b.finalScore - a.finalScore)
          .slice(0, 10);
        setRanked(candidates);
        setStatus('done');
        setProcessed(total);
        setEndTime(Date.now());
      }
    }, tickMs);
  };

  const showHomeNav = view === 'home' || view === 'profile';

  return (
    <>
      {showHomeNav ? (
        <HomeNavbar
          onBrandClick={() => setView('home')}
          onProfileClick={() => setView('profile')}
          onLogout={logout}
        />
      ) : (
        <TopBar
          isLoggedIn={Boolean(user)}
          onBrandClick={() => setView(user ? 'home' : 'landing')}
          onSignIn={() => openAuth('signin')}
          onSignUp={() => openAuth('signup')}
          onLogout={logout}
        />
      )}

      <main className={`${styles.container} ${styles.main}`}>
        {view === 'landing' && (
          <LandingPage
            onRecruiterSignUp={() => openAuth('signup', 'recruiter')}
            onStudentSignUp={() => openAuth('signup', 'student')}
            onSignIn={() => openAuth('signin')}
          />
        )}

        {view === 'auth' && (
          <AuthPage
            authMode={authMode}
            roleChoice={roleChoice}
            name={name}
            email={email}
            password={password}
            confirmPassword={confirmPassword}
            phoneNumber={phoneNumber}
            age={age}
            gender={gender}
            address={address}
            authError={authError}
            onSetRoleChoice={setRoleChoice}
            onSetName={setName}
            onSetEmail={setEmail}
            onSetPassword={setPassword}
            onSetConfirmPassword={setConfirmPassword}
            onSetPhoneNumber={setPhoneNumber}
            onSetAge={setAge}
            onSetGender={setGender}
            onSetAddress={setAddress}
            onSwitchMode={() => {
              setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
              setAuthError(null);
            }}
            onSubmit={submitAuth}
          />
        )}

        {view === 'home' && user?.role === 'student' && <StudentHome name={user.name} />}

        {view === 'home' && user?.role === 'recruiter' && (
          <RecruiterHome
            name={user.name}
            bulkSize={bulkSize}
            processed={processed}
            progress={progress}
            status={status}
            blindMode={blindMode}
            etaSeconds={etaSeconds}
            throughput={throughput}
            ranked={ranked}
            onBulkSizeChange={setBulkSize}
            onBlindModeChange={setBlindMode}
            onStartProcessing={runRecruiterDemo}
          />
        )}

        {view === 'profile' && user && (
          <ProfilePage
            user={user}
            onUpdateProfile={({ name: newName, email: newEmail }) =>
              setUser((u) => (u ? { ...u, name: newName, email: newEmail } : null))
            }
            onBackToHome={() => setView('home')}
          />
        )}
      </main>
    </>
  );
}

export default App;
