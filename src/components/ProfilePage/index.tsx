import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { profilePageStyles as styles } from './stylecomponent';

type ProfilePageProps = {
  user: User;
  onUpdateProfile: (updates: { name: string; email: string }) => void;
  onBackToHome: () => void;
};

function ProfilePage({ user, onUpdateProfile, onBackToHome }: ProfilePageProps) {
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  useEffect(() => {
    setName(user.name);
    setEmail(user.email);
  }, [user.name, user.email]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({ name: name.trim() || user.name, email: email.trim() || user.email });
    onBackToHome();
  };

  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.header}>
          <h2>Profile</h2>
          <p>Manage your account details.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <article className={styles.panel}>
            <h3>Account</h3>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="profile-name">
                Name
              </label>
              <input
                id="profile-name"
                type="text"
                className={styles.input}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="profile-email">
                Email
              </label>
              <input
                id="profile-email"
                type="email"
                className={styles.input}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label}>Role</label>
              <div className={styles.readonly} aria-readonly>
                {user.role}
              </div>
            </div>

            {user.profile && (
              <>
                {user.profile.state_name != null && user.profile.state_name !== '' && (
                  <div className={styles.field}>
                    <label className={styles.label}>State</label>
                    <div className={styles.readonly} aria-readonly>
                      {user.profile.state_name}
                    </div>
                  </div>
                )}
                {user.profile.district_name != null && user.profile.district_name !== '' && (
                  <div className={styles.field}>
                    <label className={styles.label}>District</label>
                    <div className={styles.readonly} aria-readonly>
                      {user.profile.district_name}
                    </div>
                  </div>
                )}
                {user.profile.designation != null && user.profile.designation !== '' && (
                  <div className={styles.field}>
                    <label className={styles.label}>Designation</label>
                    <div className={styles.readonly} aria-readonly>
                      {user.profile.designation}
                    </div>
                  </div>
                )}
                {user.profile.phone != null && user.profile.phone !== '' && (
                  <div className={styles.field}>
                    <label className={styles.label}>Phone</label>
                    <div className={styles.readonly} aria-readonly>
                      {user.profile.phone}
                    </div>
                  </div>
                )}
              </>
            )}

            <div className={styles.actions}>
              <button type="submit" className={styles.primaryButton}>
                Save changes
              </button>
              <button type="button" className={styles.secondaryButton} onClick={onBackToHome}>
                Back to dashboard
              </button>
            </div>
          </article>
        </form>
      </div>
    </section>
  );
}

export default ProfilePage;
