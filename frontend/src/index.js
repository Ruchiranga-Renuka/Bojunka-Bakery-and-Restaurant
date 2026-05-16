import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Login from './pages/Login';
import FoodList from './pages/FoodList';
import './index.css';

function App(){
  return (
    <BrowserRouter>
      <nav>
        <Link to="/restaurant">Restaurant</Link> | <Link to="/bakery">Bakery</Link>
      </nav>
      <Routes>
        <Route path="/:category/login" element={<Login/>} />
        <Route path="/:category" element={<FoodList/>} />
      </Routes>
    </BrowserRouter>
  );
}

createRoot(document.getElementById('root')).render(<App />);
