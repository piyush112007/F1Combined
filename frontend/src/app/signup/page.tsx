'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FcGoogle } from 'react-icons/fc';
import DriverAvatarModal from '../../components/DriverAvatarModal';
import styles from '../auth.module.css';

export default function SignupPage() {
  const router = useRouter();
  const { loginWithGoogle, signupWithEmail, driverAvatar, openAvatarModal } = useAuth();
  const { showToast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleSignup = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      showToast('Welcome to F1 Combined', 'Signed up with Google successfully', 'success');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Google sign-up failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match. Please verify your password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signupWithEmail(email, password, name);
      showToast('Welcome to F1 Combined', 'Account created successfully. Driver avatar active.', 'success');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Signup failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <DriverAvatarModal />
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/">
            <img src="/image.png" alt="F1 Combined Logo" className={styles.logoImg} />
          </Link>
          <h1 className={styles.title}>Create an Account</h1>
          <p className={styles.subtitle}>Join F1 Combined and set your driver avatar</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button className={styles.googleBtn} onClick={handleGoogleSignup} disabled={loading}>
          <FcGoogle size={20} />
          <span>Sign up with Google</span>
        </button>

        <div className={styles.divider}>
          <span>Or sign up with email</span>
        </div>

        <form className={styles.form} onSubmit={handleEmailSignup}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="name">Full Name</label>
            <input
              id="name"
              type="text"
              className={styles.input}
              placeholder="Max Verstappen"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className={styles.input}
              placeholder="name@team.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className={styles.input}
              placeholder="Minimum 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              className={styles.input}
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <div className={styles.avatarSection}>
            <label className={styles.label}>Selected F1 Driver Avatar</label>
            <div className={styles.avatarPreview}>
              <img
                src={driverAvatar.headshotUrl}
                alt={driverAvatar.name}
                className={styles.avatarHeadshot}
                style={{ backgroundColor: driverAvatar.teamColor, borderColor: driverAvatar.contrastColor }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--text-primary)' }}>
                  {driverAvatar.name} #{driverAvatar.number}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>
                  {driverAvatar.team}
                </div>
              </div>
              <button
                type="button"
                className={styles.changeAvatarBtn}
                onClick={openAvatarModal}
              >
                Change Avatar
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className={styles.footer}>
          Already have an account?
          <Link href="/login" className={styles.link}>Sign in</Link>
        </div>
      </div>
    </div>
  );
}
