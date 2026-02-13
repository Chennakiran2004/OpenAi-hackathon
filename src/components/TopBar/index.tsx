import React, { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  const path = window.location.pathname;

  return (
    <header className={`${styles.header} ${scrolled ? styles.headerScrolled : ''}`} style={{ display: path === '/auth' ? 'none' : 'block' }} >
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
