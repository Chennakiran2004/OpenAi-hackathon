const HOME_NAV_STYLE_ID = 'tf-home-navbar-styles';

const homeNavCss = `
.hn-bar {
  box-sizing: border-box;
  width: 100%;
  max-width: 100%;
  background: #1a1a1a;
  padding: 0.875rem 2rem 0.875rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
  border-bottom: 1px solid rgba(102, 102, 102, 0.2);
  overflow-x: hidden;
}

.hn-right {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-shrink: 0;
}

.hn-profile-link {
  flex-shrink: 0;
  padding: 0.5rem 0.25rem;
  background: none;
  border: none;
  color: #E0E0E0;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: text-decoration 0.15s ease;
}

.hn-profile-link:hover {
  text-decoration: underline;
}

.hn-profile-link:focus-visible {
  outline: 2px solid #888888;
  outline-offset: 2px;
}

.hn-brand-btn {
  all: unset;
  cursor: pointer;
  color: #E0E0E0;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.9rem;
  font-weight: 800;
  white-space: nowrap;
  min-width: 0;
  flex-shrink: 1;
  overflow: hidden;
  text-overflow: ellipsis;
}

.hn-brand-btn:hover {
  opacity: 0.9;
}

.hn-logout {
  flex-shrink: 0;
  padding: 0.5rem 0.25rem;
  background: none;
  border: none;
  color: #E0E0E0;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  transition: text-decoration 0.15s ease;
}

.hn-logout:hover {
  text-decoration: underline;
}

.hn-logout:focus-visible {
  outline: 2px solid #888888;
  outline-offset: 2px;
}
`;

if (typeof document !== 'undefined' && !document.getElementById(HOME_NAV_STYLE_ID)) {
  const styleEl = document.createElement('style');
  styleEl.id = HOME_NAV_STYLE_ID;
  styleEl.textContent = homeNavCss;
  document.head.appendChild(styleEl);
}

export const homeNavbarStyles = {
  bar: 'hn-bar',
  right: 'hn-right',
  brandButton: 'hn-brand-btn',
  profileLink: 'hn-profile-link',
  logout: 'hn-logout'
};
