import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, setToken } from '../api';

export default function FoodList({ category: defaultCategory }){
  let { category } = useParams();
  category = category || defaultCategory || 'restaurant';

  const [foods, setFoods] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(()=>{
    const token = localStorage.getItem('token');
    if (token) setToken(token);
    api.get(`/${category}/foods`).then(r=>setFoods(r.data)).catch(e=>console.error(e));
  },[category]);

  async function order(item){
    const token = localStorage.getItem('token');
    if (!token) { alert('Please login first'); return; }
    const qty = Number(prompt('Quantity', '1')) || 1;
    try{
      await api.post(`/${category}/orders`, { itemId: item.id, quantity: qty, customer: 'web' });
      alert('Order placed');
    }catch(err){
      alert(err.response?.data?.error || err.message);
    }
  }

  const filteredFoods = foods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div>
      <div className="page-header">
        All Products
      </div>
      
      <div className="container">
        <h3 className="section-title">All Products</h3>
        <p className="section-subtitle">These all are available products. Kindly click on the products to see the details of it.</p>
        
        <div className="search-container">
          <label>Search Products:</label>
          <input 
            type="text" 
            placeholder="Search Products" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn-primary">Search</button>
          <button className="btn-secondary" onClick={() => setSearchTerm('')}>Reset</button>
        </div>

        <div className="product-grid">
          {filteredFoods.map(f => (
            <div className="product-card" key={f.id}>
              <div className="product-tag">{category === 'restaurant' ? 'Meal' : 'Bakery'}</div>
              <img src="https://via.placeholder.com/250x200.png?text=Food+Item" alt={f.name} className="product-image" />
              <div className="product-info">
                <div className="product-name">{f.name}</div>
                <div className="product-price">Rs. {f.price} | {f.quantity} available</div>
                <button className="product-order-btn" onClick={() => order(f)}>Add to Cart</button>
              </div>
            </div>
          ))}
          {filteredFoods.length === 0 && <p>No products available right now.</p>}
        </div>
      </div>
    </div>
  );
}
