import { useCallback, useEffect, useState } from 'react';
import { addFood, fetchFoods } from '../api';
import { useAuth } from '../context/AuthContext';
import { formatPrice } from '../utils/currency';

export default function AdminDashboard() {
  const { token } = useAuth();
  const [category, setCategory] = useState('restaurant');
  const [restaurantFoods, setRestaurantFoods] = useState([]);
  const [bakeryFoods, setBakeryFoods] = useState([]);
  const [form, setForm] = useState({ name: '', price: '', quantity: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadAll = useCallback(async () => {
    try {
      const [restaurant, bakery] = await Promise.all([
        fetchFoods('restaurant'),
        fetchFoods('bakery'),
      ]);
      setRestaurantFoods(restaurant);
      setBakeryFoods(bakery);
    } catch (err) {
      setError(err.message || 'Failed to load foods');
    }
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleAdd = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      await addFood(token, category, {
        name: form.name.trim(),
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity, 10),
      });
      setMessage(`Added "${form.name}" to ${category}.`);
      setForm({ name: '', price: '', quantity: '' });
      loadAll();
    } catch (err) {
      setError(err.message || 'Could not add food item');
    } finally {
      setSubmitting(false);
    }
  };

  const currentList = category === 'restaurant' ? restaurantFoods : bakeryFoods;

  return (
    <section className="admin-page">
      <header className="page-header">
        <h1>Admin Panel</h1>
        <p>Add and manage food items for Bojunka Bakery and Restaurant.</p>
      </header>

      <div className="admin-layout">
        <div className="admin-card">
          <h2>Add Food Item</h2>
          <form onSubmit={handleAdd} className="form-stack">
            <label>
              Category
              <select value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="restaurant">Restaurant</option>
                <option value="bakery">Bakery</option>
              </select>
            </label>
            <label>
              Item name
              <input value={form.name} onChange={update('name')} required />
            </label>
            <label>
              Price (Rs)
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={update('price')}
                required
              />
            </label>
            <label>
              Quantity in stock
              <input
                type="number"
                min="0"
                value={form.quantity}
                onChange={update('quantity')}
                required
              />
            </label>
            {error && <p className="form-error">{error}</p>}
            {message && <p className="form-success">{message}</p>}
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding…' : 'Add Food Item'}
            </button>
          </form>
        </div>

        <div className="admin-card">
          <h2>
            {category === 'restaurant' ? 'Restaurant' : 'Bakery'} Items ({currentList.length})
          </h2>
          <ul className="admin-food-list">
            {currentList.map((food) => (
              <li key={food.id}>
                <span>
                  <strong>{food.name}</strong>
                  <small>
                    {formatPrice(food.price)} · stock {food.quantity}
                  </small>
                </span>
              </li>
            ))}
            {currentList.length === 0 && <li className="muted">No items in this category yet.</li>}
          </ul>
        </div>
      </div>
    </section>
  );
}
