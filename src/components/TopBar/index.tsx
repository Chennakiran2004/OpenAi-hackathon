import React from "react";
import { topBarStyles as styles } from "./stylecomponent";

type TopBarProps = {
  isLoggedIn: boolean;
  onBrandClick: () => void;
  onSignIn: () => void;
  onSignUp: () => void;
  onLogout: () => void;
};

function TopBar({
  isLoggedIn,
  onBrandClick,
  onSignIn,
  onSignUp,
  onLogout,
}: TopBarProps) {
  return (
    <header className={styles.header} style={{ backgroundColor: "#F5F7FA" }}>
      <nav className={styles.navbar} aria-label="Primary">
        <button
          type="button"
          className={styles.brandButton}
          onClick={onBrandClick}
        >
          <span className={styles.brand}>Bharat Krishi Setu</span>
        </button>
        <div className={styles.actions}>
          {!isLoggedIn && (
            <>
              <button
                className={styles.secondaryButton}
                type="button"
                onClick={onSignIn}
              >
                Request Govt Demo
              </button>
              <button
                className={styles.primaryButton}
                type="button"
                onClick={onSignUp}
              >
                Explore Platform
              </button>
            </>
          )}
          {isLoggedIn && (
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={onLogout}
            >
              Logout
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}

export default TopBar;
