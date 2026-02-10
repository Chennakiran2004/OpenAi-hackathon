import React from 'react';
import { AuthMode, Role } from '../types';
import { authPageStyles as styles } from './stylecomponent';

type AuthPageProps = {
  authMode: AuthMode;
  roleChoice: Role;
  name: string;
  email: string;
  password: string;
  onSetRoleChoice: (role: Role) => void;
  onSetName: (value: string) => void;
  onSetEmail: (value: string) => void;
  onSetPassword: (value: string) => void;
  onSwitchMode: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

function AuthPage({
  authMode,
  roleChoice,
  name,
  email,
  password,
  onSetRoleChoice,
  onSetName,
  onSetEmail,
  onSetPassword,
  onSwitchMode,
  onSubmit
}: AuthPageProps) {
  return (
    <section className={styles.shell}>
      <article className={styles.card}>
        <h2 className={styles.title}>{authMode === 'signin' ? 'Sign in' : 'Sign up'}</h2>
        <p className={styles.subtle}>
          {authMode === 'signin'
            ? 'Access your student or recruiter workspace.'
            : 'Create your account and choose how you will use TalentForge.'}
        </p>

        <div className={styles.roleToggle} role="tablist" aria-label="Choose user role">
          <button
            type="button"
            className={`${styles.roleButton} ${roleChoice === 'student' ? styles.active : ''}`}
            onClick={() => onSetRoleChoice('student')}
          >
            Student
          </button>
          <button
            type="button"
            className={`${styles.roleButton} ${roleChoice === 'recruiter' ? styles.active : ''}`}
            onClick={() => onSetRoleChoice('recruiter')}
          >
            Recruiter
          </button>
        </div>

        <form className={styles.form} onSubmit={onSubmit}>
          {authMode === 'signup' && (
            <label className={styles.label}>
              Full name
              <input className={styles.input} value={name} onChange={(e) => onSetName(e.target.value)} placeholder="Enter your name" />
            </label>
          )}
          <label className={styles.label}>
            Email
            <input
              className={styles.input}
              type="email"
              required
              value={email}
              onChange={(e) => onSetEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              required
              value={password}
              onChange={(e) => onSetPassword(e.target.value)}
              placeholder="Enter password"
            />
          </label>
          <button className={styles.primaryButton} type="submit">
            {authMode === 'signin' ? 'Continue to Home' : 'Create and Continue'}
          </button>
        </form>

        <p className={styles.switchText}>
          {authMode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className={styles.linkButton} onClick={onSwitchMode}>
            {authMode === 'signin' ? 'Sign up' : 'Sign in'}
          </button>
        </p>
      </article>
    </section>
  );
}

export default AuthPage;
