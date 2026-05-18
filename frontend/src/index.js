import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Login from './pages/Login';
import FoodList from './pages/FoodList';
import './index.css';

function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/restaurant');
  };

  return (
    <nav className="navbar">
      <div className="logo">BOJUNKA</div>
      <div className="nav-links">
        <Link to="/restaurant">HOME</Link>
        <Link to="/restaurant">ABOUT</Link>
        <Link to="/restaurant">DASHBOARD</Link>
        <Link to="/restaurant">ALL PRODUCTS</Link>
        <Link to="/restaurant">MY ADMINISTRATION</Link>
        {token ? (
          <a href="#" onClick={handleLogout}>LOGOUT</a>
        ) : (
          <Link to="/restaurant/login">LOGIN</Link>
        )}
      </div>
    </nav>
  );
}

function App(){
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<FoodList category="restaurant" />} />
        <Route path="/:category/login" element={<Login/>} />
        <Route path="/:category" element={<FoodList/>} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
