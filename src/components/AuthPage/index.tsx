import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { authPageStyles as styles } from './stylecomponent';

function AuthPage() {
  const {
    authMode,
    roleChoice,
    setRoleChoice,
    username,
    setUsername,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    email,
    setEmail,
    stateId,
    setStateId,
    districtId,
    setDistrictId,
    stateOptions,
    districtOptions,
    stateOptionsLoading,
    districtOptionsLoading,
    designation,
    setDesignation,
    authError,
    submitAuth,
    switchMode,
  } = useAuth();

  return (
    <section className={styles.shell}>
      <article className={styles.card}>
        <h2 className={styles.title}>
          {authMode === 'signin' ? 'Sign in' : 'Register'}
        </h2>
        <p className={styles.subtle}>
          {authMode === 'signin'
            ? 'Access your Bharat Krishi Setu workspace.'
            : 'Create an account with optional state/district profile.'}
        </p>

        {authMode === 'signup' && (
          <div className={styles.roleToggle} role="tablist" aria-label="Choose user role">
            <button
              type="button"
              className={`${styles.roleButton} ${roleChoice === 'state_officer' ? styles.active : ''}`}
              onClick={() => setRoleChoice('state_officer')}
            >
              State Procurement Officer
            </button>
            <button
              type="button"
              className={`${styles.roleButton} ${roleChoice === 'central_admin' ? styles.active : ''}`}
              onClick={() => setRoleChoice('central_admin')}
            >
              Central Admin
            </button>
          </div>
        )}

        <form className={styles.form} onSubmit={submitAuth}>
          <label className={styles.label}>
            Username
            <input
              className={styles.input}
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Choose a username"
            />
          </label>
          <label className={styles.label}>
            Password
            <input
              className={styles.input}
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm password"
              />
            </label>
          )}
          {authMode === 'signup' && (
            <>
              <label className={styles.label}>
                Email (optional)
                <input
                  className={styles.input}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                />
              </label>
              <label className={styles.label}>
                First name (optional)
                <input
                  className={styles.input}
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="First name"
                />
              </label>
              <label className={styles.label}>
                Last name (optional)
                <input
                  className={styles.input}
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Last name"
                />
              </label>
              <label className={styles.label}>
                State (optional)
                <select
                  className={styles.input}
                  value={stateId === '' ? '' : stateId}
                  onChange={(e) => setStateId(e.target.value === '' ? '' : Number(e.target.value))}
                  disabled={stateOptionsLoading}
                >
                  <option value="">{stateOptionsLoading ? 'Loading…' : 'Select state (optional)'}</option>
                  {stateOptions.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.label}>
                District (optional)
                <select
                  className={styles.input}
                  value={districtId === '' ? '' : districtId}
                  onChange={(e) => setDistrictId(e.target.value === '' ? '' : Number(e.target.value))}
                  disabled={stateId === '' || districtOptionsLoading}
                >
                  <option value="">{districtOptionsLoading ? 'Loading…' : 'Select district (optional)'}</option>
                  {districtOptions.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className={styles.label}>
                Designation (optional)
                <input
                  className={styles.input}
                  type="text"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  placeholder="e.g. District Agriculture Officer"
                />
              </label>
            </>
          )}
          {authError && (
            <p className={styles.error} role="alert">
              {authError}
            </p>
          )}
          <button className={styles.primaryButton} type="submit">
            {authMode === 'signin' ? 'Continue to Dashboard' : 'Register'}
          </button>
        </form>

        <p className={styles.switchText}>
          {authMode === 'signin' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" className={styles.linkButton} onClick={switchMode}>
            {authMode === 'signin' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </article>
    </section>
  );
}

export default AuthPage;
