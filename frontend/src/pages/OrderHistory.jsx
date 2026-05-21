import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Receipt from '../components/Receipt';
import { fetchBill, fetchMyOrders, issueReceipt } from '../api';
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
  const [bill, setBill] = useState(null);
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [issuing, setIssuing] = useState(false);
  const [error, setError] = useState('');
  const [billMsg, setBillMsg] = useState('');

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [ordersData, billData] = await Promise.all([fetchMyOrders(token), fetchBill(token)]);
      setOrders(ordersData);
      setBill(billData);
    } catch (err) {
      setError(err.message || 'Could not load orders');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleIssueReceipt = async () => {
    setIssuing(true);
    setBillMsg('');
    setError('');
    try {
      const data = await issueReceipt(token);
      setReceipt(data);
      setBillMsg('Receipt issued for your current bill.');
      await loadData();
    } catch (err) {
      setError(err.message || 'Could not issue receipt');
    } finally {
      setIssuing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const totalSpent = orders.reduce((sum, order) => sum + (order.total || 0), 0);
  const billItems = bill?.items || [];
  const billTotal = bill?.totalAmount || 0;

  return (
    <section className="orders-page">
      <header className="page-header">
        <h1>My Orders</h1>
        <p>View your bill total and issue a receipt for items not yet receipted.</p>
      </header>

      <p className="orders-actions">
        <Link to="/menu" className="btn btn-sm btn-outline">
          Order more food
        </Link>
      </p>

      {loading && <p className="loading-msg">Loading your orders…</p>}
      {error && <p className="form-error">{error}</p>}
      {billMsg && <p className="form-success">{billMsg}</p>}

      {!loading && !error && (
        <section className="bill-card" aria-labelledby="bill-heading">
          <div className="bill-card-head">
            <div>
              <h2 id="bill-heading">Current bill</h2>
              <p className="bill-card-sub">
                {billItems.length} item{billItems.length === 1 ? '' : 's'} awaiting receipt
              </p>
            </div>
            <p className="bill-total-label">
              Bill total
              <strong className="bill-total-amount">{formatPrice(billTotal)}</strong>
            </p>
          </div>

          {billItems.length > 0 ? (
            <>
              <table className="bill-table">
                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Unit</th>
                    <th>Line total</th>
                  </tr>
                </thead>
                <tbody>
                  {billItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.itemName}</td>
                      <td>{item.quantity}</td>
                      <td>{formatPrice(item.itemPrice)}</td>
                      <td>{formatPrice(item.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleIssueReceipt}
                disabled={issuing}
              >
                {issuing ? 'Issuing receipt…' : 'Set receipt for bill'}
              </button>
            </>
          ) : (
            <p className="muted">No open bill items. Place a new order from the menu to start a bill.</p>
          )}
        </section>
      )}

      {receipt && (
        <section className="receipt-section">
          <h2>Your receipt</h2>
          <Receipt receipt={receipt} onPrint={handlePrint} />
        </section>
      )}

      {!loading && !error && orders.length === 0 && (
        <p className="muted center">
          You have not placed any orders yet.{' '}
          <Link to="/menu">Browse the menu</Link> to get started.
        </p>
      )}

      {!loading && !error && orders.length > 0 && (
        <>
          <h2 className="orders-history-title">Order history</h2>
          <p className="orders-summary">
            {orders.length} order{orders.length === 1 ? '' : 's'} · Lifetime total{' '}
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
                  {order.receiptNumber && (
                    <div>
                      <dt>Receipt</dt>
                      <dd>{order.receiptNumber}</dd>
                    </div>
                  )}
                </dl>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
