import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register as apiRegister } from '../api';

const INITIAL = {
  name: '',
  idNumber: '',
  phoneNumber: '',
  username: '',
  password: '',
  confirmPassword: '',
};

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState(INITIAL);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const validate = () => {
    if (!form.name.trim()) return 'Full name is required';
    if (!form.idNumber.trim()) return 'ID number is required';
    if (!form.phoneNumber.trim()) return 'Phone number is required';
    if (!form.username.trim()) return 'Username is required';
    if (form.username.trim().length < 3) return 'Username must be at least 3 characters';
    if (!form.password) return 'Password is required';
    if (form.password.length < 6) return 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) return 'Passwords do not match';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setSubmitting(true);
    try {
      const result = await apiRegister({
        name: form.name,
        idNumber: form.idNumber,
        phoneNumber: form.phoneNumber,
        username: form.username,
        password: form.password,
      });
      setSuccess(result?.message || 'Account created! You can sign in now.');
      setForm(INITIAL);
      setTimeout(() => navigate('/login/user'), 1500);
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
        <form onSubmit={handleSubmit} className="form-stack form-grid" noValidate>
          <label>
            Full name
            <input
              value={form.name}
              onChange={update('name')}
              autoComplete="name"
              disabled={submitting}
            />
          </label>
          <label>
            ID number
            <input
              value={form.idNumber}
              onChange={update('idNumber')}
              disabled={submitting}
            />
          </label>
          <label>
            Phone
            <input
              value={form.phoneNumber}
              onChange={update('phoneNumber')}
              type="tel"
              autoComplete="tel"
              disabled={submitting}
            />
          </label>
          <label>
            Username
            <input
              value={form.username}
              onChange={update('username')}
              autoComplete="username"
              disabled={submitting}
            />
          </label>
          <label>
            Password
            <input
              type="password"
              value={form.password}
              onChange={update('password')}
              autoComplete="new-password"
              disabled={submitting}
            />
          </label>
          <label>
            Confirm password
            <input
              type="password"
              value={form.confirmPassword}
              onChange={update('confirmPassword')}
              autoComplete="new-password"
              disabled={submitting}
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
