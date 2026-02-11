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
  state: string;
  department: string;
  note: string;
  authError: string | null;
  onSetRoleChoice: (role: Role) => void;
  onSetName: (value: string) => void;
  onSetEmail: (value: string) => void;
  onSetPassword: (value: string) => void;
  onSetConfirmPassword: (value: string) => void;
  onSetPhoneNumber: (value: string) => void;
  onSetState: (value: string) => void;
  onSetDepartment: (value: string) => void;
  onSetNote: (value: string) => void;
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
  state,
  department,
  note,
  authError,
  onSetRoleChoice,
  onSetName,
  onSetEmail,
  onSetPassword,
  onSetConfirmPassword,
  onSetPhoneNumber,
  onSetState,
  onSetDepartment,
  onSetNote,
  onSwitchMode,
  onSubmit
}: AuthPageProps) {
  return (
    <section className={styles.shell}>
      <article className={styles.card}>
        <h2 className={styles.title}>{authMode === 'signin' ? 'Sign in' : 'Request Demo Access'}</h2>
        <p className={styles.subtle}>
          {authMode === 'signin'
            ? 'Access your Bharat Krishi Setu workspace.'
            : 'Request access to the Bharat Krishi Setu pilot environment.'}
        </p>

        {authMode === 'signup' && (
          <div className={styles.roleToggle} role="tablist" aria-label="Choose user role">
            <button
              type="button"
              className={`${styles.roleButton} ${roleChoice === 'state_officer' ? styles.active : ''}`}
              onClick={() => onSetRoleChoice('state_officer')}
            >
              State Procurement Officer
            </button>
            <button
              type="button"
              className={`${styles.roleButton} ${roleChoice === 'central_admin' ? styles.active : ''}`}
              onClick={() => onSetRoleChoice('central_admin')}
            >
              Central Admin
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
                State
                <input
                  className={styles.input}
                  type="text"
                  value={state}
                  onChange={(e) => onSetState(e.target.value)}
                  placeholder="e.g. Telangana"
                />
              </label>
              <label className={styles.label}>
                Department / Role
                <input
                  className={styles.input}
                  type="text"
                  value={department}
                  onChange={(e) => onSetDepartment(e.target.value)}
                  placeholder="e.g. Procurement Officer"
                />
              </label>
              <label className={styles.label}>
                Notes for pilot (optional)
                <input
                  className={styles.input}
                  type="text"
                  value={note}
                  onChange={(e) => onSetNote(e.target.value)}
                  placeholder="Share procurement priorities"
                />
              </label>
            </>
          )}
          {authError && <p className={styles.error} role="alert">{authError}</p>}
          <button className={styles.primaryButton} type="submit">
            {authMode === 'signin' ? 'Continue to Dashboard' : 'Request Demo Access'}
          </button>
        </form>

        <p className={styles.switchText}>
          {authMode === 'signin' ? "Don't have access?" : 'Already have access?'}{' '}
          <button type="button" className={styles.linkButton} onClick={onSwitchMode}>
            {authMode === 'signin' ? 'Request demo' : 'Sign in'}
          </button>
        </p>
      </article>
    </section>
  );
}

export default AuthPage;
