import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchMyOrders } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleString('en-LK', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

export default function OrderHistory() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await fetchMyOrders(token);
      setOrders(data);
    } catch (err) {
      setError(err.message || 'Could not load orders');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);

  return (
    <section className="orders-page">
      <header className="page-header">
        <h1>My Orders</h1>
        <p>Items you have ordered from Bojunka Bakery and Restaurant.</p>
      </header>

      <p className="orders-actions">
        <Link to="/menu" className="btn btn-sm btn-outline">
          Order more food
        </Link>
      </p>

      {loading && <p className="loading-msg">Loading your orders…</p>}
      {error && <p className="form-error">{error}</p>}

      {!loading && !error && orders.length === 0 && (
        <p className="muted center">
          You have not placed any orders yet.{' '}
          <Link to="/menu">Browse the menu</Link> to get started.
        </p>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <p className="orders-summary">
            {orders.length} order{orders.length === 1 ? '' : 's'} · Total spent{' '}
            <strong>{formatPrice(totalSpent)}</strong>
          </p>
          <ul className="order-list">
            {orders.map((order) => (
              <li key={order.id} className="order-card">
                <div className="order-card-head">
                  <h3>{order.itemName}</h3>
                  <span className={`food-badge ${order.category}`}>{order.category}</span>
                </div>
                <dl className="order-details">
                  <div>
                    <dt>Quantity</dt>
                    <dd>{order.quantity}</dd>
                  </div>
                  <div>
                    <dt>Unit price</dt>
                    <dd>{formatPrice(order.itemPrice)}</dd>
                  </div>
                  <div>
                    <dt>Line total</dt>
                    <dd className="order-total">{formatPrice(order.total)}</dd>
                  </div>
                  <div>
                    <dt>Ordered on</dt>
                    <dd>{formatDate(order.date)}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
