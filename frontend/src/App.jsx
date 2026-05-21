import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import UserLogin from './pages/UserLogin';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';
import Menu from './pages/Menu';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/user" element={<UserLogin />} />
        <Route path="/login/admin" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/menu" element={<Menu />} />
        <Route
          path="/orders"
          element={
            <ProtectedRoute userOnly>
              <OrderHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Layout>
  );
}
