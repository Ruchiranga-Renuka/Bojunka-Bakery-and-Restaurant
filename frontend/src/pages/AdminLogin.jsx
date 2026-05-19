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
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/menu', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await apiLogin(username, password);
      if (data.role !== 'admin') {
        setError('This account is not an administrator. Use User Login instead.');
        return;
      }
      login(data.token, data.role, username);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page admin-auth">
      <div className="auth-card">
        <h1>Admin Login</h1>
        <p className="muted">Manage restaurant and bakery food items.</p>
        <form onSubmit={handleSubmit} className="form-stack">
          <label>
            Username
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
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
            />
          </label>
          {error && <p className="form-error">{error}</p>}
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? 'Signing in…' : 'Sign In as Admin'}
          </button>
        </form>
        <p className="hint-box">
          Default admin: <code>admin</code> / <code>admin123</code>
        </p>
        <p className="auth-footer">
          Customer? <Link to="/login/user">User Login</Link>
        </p>
      </div>
    </section>
  );
}
