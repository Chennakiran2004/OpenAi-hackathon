import React from 'react';
import { homeNavbarStyles as styles } from './stylecomponent';

type HomeNavbarProps = {
  onBrandClick: () => void;
  onLogout: () => void;
  onProfileClick?: () => void;
};

function HomeNavbar({ onBrandClick, onLogout, onProfileClick }: HomeNavbarProps) {
  return (
    <header className={styles.bar}>
      <button type="button" className={styles.brandButton} onClick={onBrandClick}>
        TALENTFORGE AI
      </button>
      <div className={styles.right}>
        {onProfileClick && (
          <button type="button" className={styles.profileLink} onClick={onProfileClick}>
            Profile
          </button>
        )}
        <button type="button" className={styles.logout} onClick={onLogout}>
          Logout
        </button>
      </div>
    </header>
  );
}

export default HomeNavbar;
