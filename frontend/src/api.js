const API_BASE = import.meta.env.VITE_API_URL || '';

function authHeaders(token) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }
  if (!res.ok) {
    const message = data?.error || data?.message || res.statusText;
    throw new Error(message);
  }
  return data;
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ username, password }),
  });
  return handleResponse(res);
}

export async function register(payload) {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ ...payload, role: 'customer' }),
  });
  return handleResponse(res);
}

export async function fetchProfile(token) {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: authHeaders(token),
  });
  return handleResponse(res);
}

export async function fetchFoods(category) {
  const res = await fetch(`${API_BASE}/api/${category}/foods`);
  return handleResponse(res);
}

export async function addFood(token, category, food) {
  const res = await fetch(`${API_BASE}/api/${category}/foods`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(food),
  });
  return handleResponse(res);
}

export async function placeOrder(token, category, order) {
  const res = await fetch(`${API_BASE}/api/${category}/orders`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(order),
  });
  return handleResponse(res);
}
