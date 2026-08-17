'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { RxHamburgerMenu, RxCross2 } from 'react-icons/rx';
import {
  FiLogOut,
  FiUserCheck,
  FiArrowLeft,
  FiArrowRight,
  FiCalendar
} from 'react-icons/fi';
import {
  GiSpanner,
  GiFullMotorcycleHelmet,
  GiCheckeredFlag,
  GiSpeedometer,
  GiCrossedSwords
} from 'react-icons/gi';
import styles from '../app/layout.module.css';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLatestWeekend, useSchedule } from '../api';
import DriverAvatarModal from './DriverAvatarModal';

const NAV_ITEMS = [
  { href: '/', label: 'Dashboard', icon: GiSpeedometer },
  { href: '/weekends', label: 'Weekends', icon: FiCalendar },
  { href: '/drivers', label: 'Drivers', icon: GiFullMotorcycleHelmet },
  { href: '/constructors', label: 'Constructors', icon: GiSpanner },
  { href: '/circuits', label: 'Circuits (Coming Soon)', icon: GiCheckeredFlag },
  { href: '/compare', label: 'Compare (Coming Soon)', icon: GiCrossedSwords },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [showSignOutModal, setShowSignOutModal] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Load sidebar collapsed state from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('sidebar_collapsed');
      if (saved === 'true') {
        setSidebarCollapsed(true);
      }
    }
  }, []);

  // Trigger resize event after transition ends to make pages/charts responsive
  useEffect(() => {
    const timer = setTimeout(() => {
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new Event('resize'));
      }
    }, 320);
    return () => clearTimeout(timer);
  }, [sidebarCollapsed]);

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('sidebar_collapsed', String(next));
      return next;
    });
  };
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const hasTriggeredToast = useRef(false);

  const { user, logout, driverAvatar, openAvatarModal } = useAuth();
  const { showToast } = useToast();
  const { data: latestWeekend } = useLatestWeekend();
  const { data: schedule } = useSchedule();

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show First-Time Visit Race Status Toast with Exact Most Recent Race Name Heading
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (hasTriggeredToast.current) return;

    // Find the most recent race from latestWeekend or schedule API data
    let raceName = latestWeekend?.name || (latestWeekend as any)?.raceName;
    let raceRound = latestWeekend?.round;

    if (!raceName && schedule && schedule.length > 0) {
      const now = new Date();
      const pastRaces = schedule.filter((r: any) => {
        const raceDate = new Date(`${r.date}T${r.time || '00:00:00Z'}`);
        return raceDate <= now;
      });

      const mostRecent = pastRaces.length > 0 ? pastRaces[pastRaces.length - 1] : schedule[0];
      raceName = mostRecent?.raceName || mostRecent?.name || mostRecent?.Circuit?.circuitName;
      raceRound = mostRecent?.round || 1;
    }

    // Wait until the real race data is loaded from the backend API
    if (!raceName) return;

    const toastShown = sessionStorage.getItem('f1_race_status_toast_shown');
    if (toastShown) return;

    hasTriggeredToast.current = true;
    sessionStorage.setItem('f1_race_status_toast_shown', 'true');

    const formattedHeading = raceName.includes('2026') ? raceName : `${raceName} 2026`;
    const targetRound = raceRound || 1;

    showToast(
      formattedHeading,
      'Race weekend classification and timing data are live.',
      'info',
      {
        label: 'Watch Race Details',
        onClick: () => {
          router.push(`/weekends/${targetRound}`);
        },
      }
    );
  }, [router, showToast, latestWeekend, schedule]);

  const closeSidebar = () => setSidebarOpen(false);

  const handleConfirmSignOut = async () => {
    setShowSignOutModal(false);
    await logout();
    showToast('Signed Out', 'You have been signed out successfully.', 'info');
  };

  // If on Login or Signup page, render children full screen without AppShell layout
  const isAuthPage = pathname === '/login' || pathname === '/signup';
  if (isAuthPage) {
    return (
      <>
        <DriverAvatarModal />
        {children}
      </>
    );
  }

  return (
    <div className={styles.appContainer}>
      <DriverAvatarModal />

      {/* Sign Out Confirmation Modal */}
      {showSignOutModal && (
        <div className={styles.signOutOverlay} onClick={() => setShowSignOutModal(false)}>
          <div className={styles.signOutCard} onClick={(e) => e.stopPropagation()}>
            <div className={styles.signOutIconWrapper}>
              <FiLogOut size={26} />
            </div>
            <h2 className={styles.signOutTitle}>Confirm Sign Out</h2>
            <p className={styles.signOutMessage}>
              Are you sure you want to sign out of your F1 Combined account?
            </p>
            <div className={styles.signOutActions}>
              <button
                className={styles.signOutCancelBtn}
                onClick={() => setShowSignOutModal(false)}
              >
                Cancel
              </button>
              <button
                className={styles.signOutConfirmBtn}
                onClick={handleConfirmSignOut}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {sidebarOpen && (
        <div className={styles.overlay} onClick={closeSidebar} aria-hidden="true" />
      )}

      <nav className={`${styles.sidebar} ${sidebarOpen ? styles.sidebarOpen : ''} ${sidebarCollapsed ? styles.sidebarCollapsed : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.logo}>
            <Link href="/" className={styles.logoLink} onClick={closeSidebar}>
              <img src="/image.png" alt="F1 Combined Logo" className={`${styles.logoImg} ${styles.logoFull}`} />
              <img src="/logocollapsed.png" alt="F1 Combined Logo" className={`${styles.logoImg} ${styles.logoCollapsed}`} />
            </Link>
          </div>
          <button
            className={styles.closeSidebarBtn}
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <RxCross2 size={22} />
          </button>
        </div>

        <div className={styles.navLinks}>
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={styles.navLink}
                data-active={isActive}
                onClick={closeSidebar}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <Icon className={styles.navIcon} size={18} />
                <span className={styles.navLabel}>{item.label}</span>
              </Link>
            );
          })}
        </div>

        <div className={styles.navFooter}>
          <button
            className={styles.settingsBtn}
            onClick={openAvatarModal}
            title={sidebarCollapsed ? "Driver Avatar" : undefined}
          >
            <FiUserCheck size={16} className={styles.navIcon} />
            <span className={styles.navLabel}>Driver Avatar</span>
          </button>
        </div>

        {/* Floating collapse button on the right border */}
        <button
          className={styles.collapseBtn}
          onClick={toggleSidebarCollapsed}
          aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {sidebarCollapsed ? <FiArrowRight size={16} /> : <FiArrowLeft size={16} />}
        </button>
      </nav>

      <main className={styles.mainContent}>
        <header className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <button
              className={styles.menuBtn}
              onClick={() => setSidebarOpen((prev) => !prev)}
              aria-label={sidebarOpen ? 'Close menu' : 'Open menu'}
            >
              {sidebarOpen ? <RxCross2 size={24} /> : <RxHamburgerMenu size={24} />}
            </button>
            <Link href="/" className={styles.mobileBrandLogo}>
              <img src="/image.png" alt="F1 Combined Logo" className={styles.mobileLogoImg} />
            </Link>
          </div>

          <div className={styles.userProfile} ref={dropdownRef}>
            <button
              className={styles.avatarBtn}
              onClick={() => setUserDropdownOpen((prev) => !prev)}
              style={{ borderColor: driverAvatar.contrastColor }}
              aria-label="User profile menu"
            >
              <img
                src={driverAvatar.headshotUrl}
                alt={driverAvatar.name}
                className={styles.avatar}
                style={{ backgroundColor: driverAvatar.teamColor, border: '1.5px solid', borderColor: driverAvatar.contrastColor }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent && !parent.querySelector(`.${styles.avatarFallback}`)) {
                    const fallback = document.createElement('div');
                    fallback.className = styles.avatarFallback;
                    fallback.innerText = driverAvatar.code;
                    parent.appendChild(fallback);
                  }
                }}
              />
            </button>

            {userDropdownOpen && (
              <div className={styles.userDropdown}>
                <div className={styles.dropdownDriverBanner}>
                  <div
                    className={styles.dropdownHeadshotWrapper}
                    style={{ borderColor: driverAvatar.contrastColor, backgroundColor: driverAvatar.teamColor }}
                  >
                    <img
                      src={driverAvatar.headshotUrl}
                      alt={driverAvatar.name}
                      className={styles.dropdownHeadshotImg}
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                  </div>
                  <div className={styles.dropdownDriverInfo}>
                    <div className={styles.dropdownDriverCode}>
                      {driverAvatar.code} #{driverAvatar.number}
                    </div>
                    <div className={styles.dropdownDriverName}>{driverAvatar.name}</div>
                    <div
                      className={styles.dropdownTeamBadge}
                      style={{ backgroundColor: driverAvatar.teamColor }}
                    >
                      {driverAvatar.team}
                    </div>
                  </div>
                </div>

                <div className={styles.dropdownUserInfo}>
                  <div className={styles.dropdownUserName}>
                    {user ? (user.displayName || user.email?.split('@')[0]) : 'Guest Analyst'}
                  </div>
                  <div className={styles.dropdownUserEmail}>
                    {user?.email || 'Guest Mode'}
                  </div>
                  <div className={styles.dropdownUserStatus}>
                    <span className={styles.dropdownStatusDot} />
                    <span>{user ? 'F1 Verified User' : 'Active Guest Session'}</span>
                  </div>
                </div>

                <div className={styles.dropdownActions}>
                  <button
                    className={styles.dropdownActionBtn}
                    onClick={() => {
                      setUserDropdownOpen(false);
                      openAvatarModal();
                    }}
                  >
                    <FiUserCheck size={16} />
                    <span>Change Driver Avatar</span>
                  </button>

                  {!user ? (
                    <>
                      <Link
                        href="/login"
                        className={styles.dropdownActionBtn}
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <span>Sign In</span>
                      </Link>
                      <Link
                        href="/signup"
                        className={styles.dropdownActionBtn}
                        onClick={() => setUserDropdownOpen(false)}
                      >
                        <span>Sign Up</span>
                      </Link>
                    </>
                  ) : (
                    <button
                      className={`${styles.dropdownActionBtn} ${styles.dropdownLogoutBtn}`}
                      onClick={() => {
                        setUserDropdownOpen(false);
                        setShowSignOutModal(true);
                      }}
                    >
                      <FiLogOut size={16} />
                      <span>Sign Out</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </header>

        <div className={styles.pageContent}>{children}</div>
      </main>
    </div>
  );
}
