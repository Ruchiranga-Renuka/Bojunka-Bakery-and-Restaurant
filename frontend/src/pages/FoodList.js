import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api, setToken } from '../api';

export default function FoodList(){
  const { category } = useParams();
  const [foods, setFoods] = useState([]);
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
      const res = await api.post(`/${category}/orders`, { itemId: item._id, quantity: qty, customer: 'web' });
      alert('Order placed');
    }catch(err){
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <div>
      <h2>{category} Foods</h2>
      <Link to={`/${category}/login`}>Login</Link>
      <ul>
        {foods.map(f=> (
          <li key={f._id}>{f.name} - ${f.price} - {f.quantity} available
            <button onClick={()=>order(f)}>Order</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
