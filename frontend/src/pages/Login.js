import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { api, setToken } from '../api';

export default function Login(){
  const { category } = useParams();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  async function submit(e){
    e.preventDefault();
    try{
      const res = await api.post('/auth/login', { username, password });
      const token = res.data.token;
      setToken(token);
      localStorage.setItem('token', token);
      localStorage.setItem('role', res.data.role);
      navigate(`/${category}`);
    }catch(err){
      alert(err.response?.data?.error || err.message);
    }
  }

  return (
    <div>
      <h2>Login to {category}</h2>
      <form onSubmit={submit}>
        <input placeholder="username" value={username} onChange={e=>setUsername(e.target.value)} />
        <input placeholder="password" value={password} onChange={e=>setPassword(e.target.value)} type="password" />
        <button>Login</button>
      </form>
    </div>
  );
}
