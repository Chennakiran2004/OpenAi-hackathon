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
      <div className={styles.navbar}>
        <button type="button" className={styles.brandButton} onClick={onBrandClick}>
          <span className={styles.brand}>Bharat Krishi Setu (BKS)</span>
        </button>
        <div className={styles.actions}>
          {!isLoggedIn && (
            <>
              <button className={styles.secondaryButton} type="button" onClick={onSignIn}>
                View Sandbox
              </button>
              <button className={styles.primaryButton} type="button" onClick={onSignUp}>
                Request Demo
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
