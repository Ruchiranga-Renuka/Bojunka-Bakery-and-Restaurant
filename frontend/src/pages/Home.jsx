import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <section className="hero">
      <p className="eyebrow">Welcome to</p>
      <h1>Bojunka Bakery and Restaurant</h1>
      <p className="hero-text">
        Fresh bakery treats and hearty restaurant meals — browse our menu, sign in as a
        customer to place orders, or manage items from the admin panel.
      </p>
      <div className="hero-actions">
        <Link to="/menu" className="btn btn-primary">
          View Menu
        </Link>
        {!isAuthenticated && (
          <>
            <Link to="/login/user" className="btn btn-secondary">
              User Login
            </Link>
            <Link to="/login/admin" className="btn btn-outline">
              Admin Login
            </Link>
          </>
        )}
        {isAuthenticated && isAdmin && (
          <Link to="/admin" className="btn btn-secondary">
            Admin Panel
          </Link>
        )}
        {isAuthenticated && !isAdmin && (
          <Link to="/menu" className="btn btn-secondary">
            Order Now
          </Link>
        )}
      </div>
      <div className="hero-cards">
        <article className="info-card">
          <h3>Restaurant</h3>
          <p>Hot meals, rice plates, and daily specials.</p>
        </article>
        <article className="info-card">
          <h3>Bakery</h3>
          <p>Fresh bread, pastries, and sweet treats.</p>
        </article>
      </div>
    </section>
  );
}
