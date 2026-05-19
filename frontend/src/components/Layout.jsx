import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Layout({ children }) {
  const { isAuthenticated, isAdmin, username, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="app-shell">
      <header className="site-header">
        <Link to="/" className="brand">
          <span className="brand-mark">B</span>
          <span>
            <strong>Bojunka</strong>
            <small>Bakery &amp; Restaurant</small>
          </span>
        </Link>
        <nav className="site-nav">
          <Link to="/menu">Menu</Link>
          {!isAuthenticated && (
            <>
              <Link to="/login/user">User Login</Link>
              <Link to="/login/admin" className="nav-admin">
                Admin Login
              </Link>
              <Link to="/register" className="btn btn-sm btn-outline">
                Sign Up
              </Link>
            </>
          )}
          {isAuthenticated && isAdmin && <Link to="/admin">Admin Panel</Link>}
          {isAuthenticated && !isAdmin && <Link to="/menu">Order Food</Link>}
          {isAuthenticated && (
            <button type="button" className="btn btn-sm btn-ghost" onClick={handleLogout}>
              Logout {username ? `(${username})` : ''}
            </button>
          )}
        </nav>
      </header>
      <main className="site-main">{children}</main>
      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} Bojunka Bakery and Restaurant</p>
      </footer>
    </div>
  );
}
