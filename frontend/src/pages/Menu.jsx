import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchFoods, placeOrder } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';

const TABS = [
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'bakery', label: 'Bakery' },
];

export default function Menu() {
  const { isAuthenticated, isAdmin, token, name, username } = useAuth();
  const [tab, setTab] = useState('restaurant');
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderMsg, setOrderMsg] = useState('');
  const [quantities, setQuantities] = useState({});

  const loadFoods = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchFoods(tab);
      setFoods(data);
      setQuantities({});
    } catch (err) {
      setError(err.message || 'Could not load menu');
    } finally {
      setLoading(false);
    }
  }, [tab]);

  useEffect(() => {
    loadFoods();
  }, [loadFoods]);

  const setQty = (id, value) => {
    const qty = Math.max(1, parseInt(value, 10) || 1);
    setQuantities((q) => ({ ...q, [id]: qty }));
  };

  const handleOrder = async (food) => {
    if (!isAuthenticated || isAdmin) return;
    setOrderMsg('');
    try {
      await placeOrder(token, tab, {
        itemId: food.id,
        quantity: quantities[food.id] || 1,
        customer: name || username,
      });
      setOrderMsg(`Order placed for ${food.name}!`);
      loadFoods();
    } catch (err) {
      setOrderMsg(err.message || 'Order failed');
    }
  };

  return (
    <section className="menu-page">
      <header className="page-header">
        <h1>Our Menu</h1>
        <p>Bojunka Bakery and Restaurant — choose restaurant meals or bakery favorites.</p>
      </header>

      <div className="tabs">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className={tab === t.id ? 'tab active' : 'tab'}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {!isAuthenticated && (
        <p className="banner banner-info">
          <Link to="/login/user">Sign in</Link> or <Link to="/register">register</Link> to place
          orders.
        </p>
      )}
      {isAdmin && (
        <p className="banner banner-warn">
          You are logged in as admin. <Link to="/admin">Go to Admin Panel</Link> to add food items.
        </p>
      )}

      {loading && <p className="loading-msg">Loading menu…</p>}
      {error && <p className="form-error">{error}</p>}
      {orderMsg && <p className="form-success">{orderMsg}</p>}

      <div className="food-grid">
        {!loading &&
          foods.map((food) => (
            <article key={food.id} className="food-card">
              <span className={`food-badge ${tab}`}>{tab}</span>
              <h3>{food.name}</h3>
              <p className="food-price">{formatPrice(food.price)}</p>
              <p className="food-stock">In stock: {food.quantity}</p>
              {isAuthenticated && !isAdmin && food.quantity > 0 && (
                <div className="order-row">
                  <label>
                    Qty
                    <input
                      type="number"
                      min="1"
                      max={food.quantity}
                      value={quantities[food.id] || 1}
                      onChange={(e) => setQty(food.id, e.target.value)}
                    />
                  </label>
                  <button type="button" className="btn btn-sm btn-primary" onClick={() => handleOrder(food)}>
                    Order
                  </button>
                </div>
              )}
            </article>
          ))}
      </div>

      {!loading && !error && foods.length === 0 && (
        <p className="muted center">No items yet. Admin can add food from the admin panel.</p>
      )}
    </section>
  );
}
