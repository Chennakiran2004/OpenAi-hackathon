import React from 'react';
import { topBarStyles as styles } from './stylecomponent';

type TopBarProps = {
  isLoggedIn: boolean;
  onBrandClick: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
  onLogout: () => void;
};

function TopBar({ isLoggedIn, onBrandClick, onSignIn, onSignUp, onLogout }: TopBarProps) {
  return (
    <header className={styles.header}>
      <div className={styles.row}>
        <button type="button" className={styles.brandButton} onClick={onBrandClick}>
          <span className={styles.brand}>TalentForge AI</span>
          <span className={styles.tag}>Intelligent Job Matching & Recruiter Screening Platform</span>
        </button>
        <div className={styles.actions}>
          {!isLoggedIn && (
            <>
              <button className={styles.secondaryButton} type="button" onClick={onSignIn}>
                Sign in
              </button>
              <button className={styles.primaryButton} type="button" onClick={onSignUp}>
                Sign up
              </button>
            </>
          )}
          {isLoggedIn && (
            <button className={styles.secondaryButton} type="button" onClick={onLogout}>
              Logout
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export default TopBar;
