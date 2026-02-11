import React from 'react';
import { AuthMode, Role } from '../types';
import { authPageStyles as styles } from './stylecomponent';

type AuthPageProps = {
  authMode: AuthMode;
  roleChoice: Role;
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  age: string;
  gender: string;
  address: string;
  authError: string | null;
  onSetRoleChoice: (role: Role) => void;
  onSetName: (value: string) => void;
  onSetEmail: (value: string) => void;
  onSetPassword: (value: string) => void;
  onSetConfirmPassword: (value: string) => void;
  onSetPhoneNumber: (value: string) => void;
  onSetAge: (value: string) => void;
  onSetGender: (value: string) => void;
  onSetAddress: (value: string) => void;
  onSwitchMode: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
};

function AuthPage({
  authMode,
  roleChoice,
  name,
  email,
  password,
  confirmPassword,
  phoneNumber,
  age,
  gender,
  address,
  authError,
  onSetRoleChoice,
  onSetName,
  onSetEmail,
  onSetPassword,
  onSetConfirmPassword,
  onSetPhoneNumber,
  onSetAge,
  onSetGender,
  onSetAddress,
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

        {authMode === 'signup' && (
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
        )}

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
          {authMode === 'signup' && (
            <label className={styles.label}>
              Confirm password
              <input
                className={styles.input}
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => onSetConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
            </label>
          )}
          {authMode === 'signup' && (
            <>
              <label className={styles.label}>
                Phone number
                <input
                  className={styles.input}
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => onSetPhoneNumber(e.target.value)}
                  placeholder="e.g. 9999999999"
                />
              </label>
              <label className={styles.label}>
                Age
                <input
                  className={styles.input}
                  type="number"
                  min={1}
                  max={120}
                  value={age}
                  onChange={(e) => onSetAge(e.target.value)}
                  placeholder="e.g. 22"
                />
              </label>
              <label className={styles.label}>
                Gender
                <input
                  className={styles.input}
                  type="text"
                  value={gender}
                  onChange={(e) => onSetGender(e.target.value)}
                  placeholder="e.g. Male"
                />
              </label>
              <label className={styles.label}>
                Address
                <input
                  className={styles.input}
                  type="text"
                  value={address}
                  onChange={(e) => onSetAddress(e.target.value)}
                  placeholder="e.g. Some address"
                />
              </label>
            </>
          )}
          {authError && <p className={styles.error} role="alert">{authError}</p>}
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
