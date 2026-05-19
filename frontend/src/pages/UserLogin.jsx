import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login as apiLogin } from '../api';
import { useAuth } from '../context/AuthContext';

export default function UserLogin() {
  const navigate = useNavigate();
  const { login, logout, isAuthenticated, isAdmin } = useAuth();
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
    logout();
    try {
      const data = await apiLogin(username, password);
      if (data.role === 'admin') {
        setError('Please use Admin Login for administrator accounts.');
        return;
      }
      login(data.token, data.role, username);
      navigate('/menu');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card">
        <h1>User Login</h1>
        <p className="muted">Sign in to browse the menu and place orders.</p>
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
            {submitting ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
        <p className="auth-footer">
          Administrator? <Link to="/login/admin">Admin Login</Link>
        </p>
      </div>
    </section>
  );
}
