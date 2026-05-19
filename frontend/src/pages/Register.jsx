import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../api';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    idNumber: '',
    phoneNumber: '',
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSubmitting(true);
    try {
      await apiRegister(form);
      setSuccess('Account created! You can sign in now.');
      setTimeout(() => navigate('/login/user'), 1200);
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-card wide">
        <h1>Create User Account</h1>
        <p className="muted">Register as a customer at Bojunka Bakery and Restaurant.</p>
        <form onSubmit={handleSubmit} className="form-stack form-grid">
          <label>
            Full name
            <input value={form.name} onChange={update('name')} required />
          </label>
          <label>
            ID number
            <input value={form.idNumber} onChange={update('idNumber')} required />
          </label>
          <label>
            Phone
            <input value={form.phoneNumber} onChange={update('phoneNumber')} required />
          </label>
          <label>
            Username
            <input value={form.username} onChange={update('username')} required />
          </label>
          <label className="span-2">
            Password
            <input
              type="password"
              value={form.password}
              onChange={update('password')}
              required
              minLength={6}
            />
          </label>
          {error && <p className="form-error span-2">{error}</p>}
          {success && <p className="form-success span-2">{success}</p>}
          <button type="submit" className="btn btn-primary span-2" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
        <p className="auth-footer">
          Already have an account? <Link to="/login/user">User Login</Link>
        </p>
      </div>
    </section>
  );
}
