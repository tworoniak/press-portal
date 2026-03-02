import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import page from '../components/ui/Page/Page.module.scss';
import card from '../components/ui/Card/Card.module.scss';
import styles from './LoginPage.module.scss';

import { api } from '../lib/api';

type LoginResponse = { accessToken: string };

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState('admin@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.post<LoginResponse>('/auth/login', {
        email: email.trim(),
        password,
      });

      localStorage.setItem('pp_token', res.data.accessToken);
      nav('/dashboard');
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : 'Login failed. Please try again.';
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className={page.page}>
      <div className={page.container}>
        <div className={styles.wrap}>
          <div className={`${card.card} ${styles.card}`}>
            <div className={styles.header}>
              <h1 className={styles.title}>Press Portal</h1>
              <p className={styles.subtitle}>
                Sign in to manage contacts, follow-ups, and interactions.
              </p>
            </div>

            {error ? <div className={styles.error}>{error}</div> : null}

            <form className={styles.form} onSubmit={onSubmit}>
              <label className={styles.field}>
                <span className={styles.label}>Email</span>
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete='email'
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>Password</span>
                <input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type='password'
                  autoComplete='current-password'
                />
              </label>

              <div className={styles.actions}>
                <button type='submit' disabled={isLoading}>
                  {isLoading ? 'Signing in…' : 'Sign in'}
                </button>
                <span className={page.subtle}>
                  Tip: change defaults when ready
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
