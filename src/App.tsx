import React, { useMemo, useState } from 'react';
import AuthPage from './components/AuthPage';
import LandingPage from './components/LandingPage';
import RecruiterHome from './components/RecruiterHome';
import StudentHome from './components/StudentHome';
import TopBar from './components/TopBar';
import { createCandidate } from './components/candidateUtils';
import { AuthMode, Candidate, ProcessingStatus, Role, User, View } from './components/types';
import { appStyles as styles } from './stylecomponent';

function App() {
  const [view, setView] = useState<View>('landing');
  const [authMode, setAuthMode] = useState<AuthMode>('signin');
  const [roleChoice, setRoleChoice] = useState<Role>('student');
  const [user, setUser] = useState<User | null>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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

  const openAuth = (mode: AuthMode, role?: Role) => {
    if (role) {
      setRoleChoice(role);
    }
    setAuthMode(mode);
    setView('auth');
  };

  const submitAuth = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const resolvedName = name.trim() || (roleChoice === 'student' ? 'Student User' : 'Recruiter User');
    const resolvedEmail = email.trim() || (roleChoice === 'student' ? 'student@talentforge.ai' : 'recruiter@talentforge.ai');

    setUser({ name: resolvedName, email: resolvedEmail, role: roleChoice });
    setView('home');
  };

  const logout = () => {
    setUser(null);
    setName('');
    setEmail('');
    setPassword('');
    setView('landing');
  };

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

  return (
    <div className={styles.shell}>
      <TopBar
        isLoggedIn={Boolean(user)}
        onBrandClick={() => setView(user ? 'home' : 'landing')}
        onSignIn={() => openAuth('signin')}
        onSignUp={() => openAuth('signup')}
        onLogout={logout}
      />

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
            onSetRoleChoice={setRoleChoice}
            onSetName={setName}
            onSetEmail={setEmail}
            onSetPassword={setPassword}
            onSwitchMode={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
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
      </main>
    </div>
  );
}

export default App;
