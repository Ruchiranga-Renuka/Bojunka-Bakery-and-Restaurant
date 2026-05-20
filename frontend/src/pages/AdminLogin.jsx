import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../api';
import { useAuth } from '../context/AuthContext';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin123';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [username, setUsername] = useState(ADMIN_USERNAME);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const fillDemoCredentials = () => {
    setUsername(ADMIN_USERNAME);
    setPassword(ADMIN_PASSWORD);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const data = await apiLogin(username, password);
      const role = String(data.role || '').toLowerCase();

      if (role !== 'admin') {
        setError('This account is not an administrator. Use User Login for customers.');
        return;
      }

      login(data.token, role, username.trim());
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Admin login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page admin-auth">
      <div className="admin-login-layout">
        <div className="auth-card admin-login-card">
          <span className="admin-badge">Staff only</span>
          <h1>Admin Login</h1>
          <p className="muted">
            Sign in to manage food items for Bojunka Bakery and Restaurant.
          </p>

          <form onSubmit={handleSubmit} className="form-stack">
            <label>
              Admin username
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
                placeholder="admin"
                disabled={submitting}
              />
            </label>
            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                placeholder="Enter admin password"
                disabled={submitting}
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Signing in…' : 'Sign In to Admin Panel'}
            </button>
          </form>

          <button
            type="button"
            className="btn btn-outline btn-full"
            onClick={fillDemoCredentials}
            disabled={submitting}
          >
            Use default admin credentials
          </button>

          <p className="auth-footer">
            Customer account? <Link to="/login/user">User Login</Link>
          </p>
        </div>

        <aside className="admin-credentials-panel">
          <h2>Default admin details</h2>
          <p>Use these credentials after starting the Spring Boot backend:</p>
          <dl className="credential-list">
            <div>
              <dt>Username</dt>
              <dd>
                <code>{ADMIN_USERNAME}</code>
              </dd>
            </div>
            <div>
              <dt>Password</dt>
              <dd>
                <code>{ADMIN_PASSWORD}</code>
              </dd>
            </div>
          </dl>
          <p className="credential-note">
            The admin password is reset to <code>admin123</code> every time the backend
            restarts, so these details always work for development.
          </p>
          <Link to="/" className="btn btn-ghost btn-full">
            Back to home
          </Link>
        </aside>
      </div>
    </section>
  );
}
