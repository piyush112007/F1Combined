'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { HiMenu, HiX } from 'react-icons/hi';
import styles from '../app/layout.module.css';
import Providers from '../app/providers';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className={styles.appContainer}>
      {sidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar} aria-hidden="true" />
      )}

      <nav className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''}`}>
        <div className={styles.logo}>
          <Link href="/" className={styles.logoLink} onClick={closeSidebar}>
            <img src="/image.png" alt="F1 Combined Logo" className={styles.logoImg} />
          </Link>
        </div>

        <div className={styles.navLinks}>
          <Link href="/" className={styles.navLink} onClick={closeSidebar}>Dashboard</Link>
          <Link href="/weekends" className={styles.navLink} onClick={closeSidebar}>Weekends</Link>
          <Link href="/drivers" className={styles.navLink} onClick={closeSidebar}>Drivers</Link>
          <Link href="/constructors" className={styles.navLink} onClick={closeSidebar}>Constructors</Link>
          <Link href="/circuits" className={styles.navLink} onClick={closeSidebar}>Circuits</Link>
          <Link href="/compare" className={styles.navLink} onClick={closeSidebar}>Compare</Link>
        </div>

        <div className={styles.navFooter}>
          <button className={styles.settingsBtn}>Settings</button>
        </div>
      </nav>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.menuBtn}
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            >
              {sidebarOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
            <Link href="/" className={styles.topbarLogo}>
              <img src="/image.png" alt="F1 Combined Logo" className={styles.topbarLogoImg} />
            </Link>
          </div>
          <div className={styles.userProfile}>
            <div className={styles.avatar}></div>
          </div>
        </header>

        <div className={styles.pageContent}>
          <Providers>{children}</Providers>
        </div>
      </main>
    </div>
  );
}
