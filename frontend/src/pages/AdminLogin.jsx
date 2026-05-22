import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, isAuthenticated, isAdmin } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

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
              placeholder="Enter admin username"
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

        <p className="auth-footer">
          Customer account? <Link to="/login/user">User Login</Link>
        </p>
        <p className="auth-footer">
          <Link to="/">Back to home</Link>
        </p>
      </div>
    </section>
  );
}
