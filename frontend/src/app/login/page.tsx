'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { FcGoogle } from 'react-icons/fc';
import styles from '../auth.module.css';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await loginWithGoogle();
      showToast('Welcome Back', 'Logged in successfully with Google', 'success');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !confirmPassword) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please check your password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await loginWithEmail(email, password);
      showToast('Welcome Back', 'Signed in successfully. Ready for telemetry analysis.', 'success');
      router.push('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.header}>
          <Link href="/">
            <img src="/image.png" alt="F1 Combined Logo" className={styles.logoImg} />
          </Link>
          <h1 className={styles.title}>Welcome Back</h1>
          <p className={styles.subtitle}>Sign in to your F1 Engineering Analytics account</p>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <button className={styles.googleBtn} onClick={handleGoogleLogin} disabled={loading}>
          <FcGoogle size={20} />
          <span>Sign in with Google</span>
        </button>

        <div className={styles.divider}>
          <span>Or sign in with email</span>
        </div>

        <form className={styles.form} onSubmit={handleEmailLogin}>
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
              placeholder="••••••••"
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
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitBtn} disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className={styles.footer}>
          Don&apos;t have an account?
          <Link href="/signup" className={styles.link}>Sign up</Link>
        </div>
      </div>
    </div>
  );
}
