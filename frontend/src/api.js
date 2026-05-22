const API_BASE = import.meta.env.VITE_API_URL || '';

function authHeaders(token) {
  const headers = { 'Content-Type': 'application/json', Accept: 'application/json' };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }
  return headers;
}

async function handleResponse(res) {
  const contentType = res.headers.get('content-type') || '';
  let data = null;

  if (contentType.includes('application/json')) {
    data = await res.json();
  } else {
    const text = await res.text();
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = { message: text };
      }
    }
  }

  if (!res.ok) {
    if (res.status === 401) {
      throw new Error(data?.error || 'Invalid username or password');
    }
    if (res.status === 403) {
      throw new Error(
        data?.error ||
          'Access denied. Make sure the Spring Boot backend is running on port 8080, then try again.'
      );
    }
    const message = data?.error || data?.message || res.statusText || 'Request failed';
    throw new Error(message);
  }

  return data;
}

async function apiFetch(path, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${path}`, options);
    return handleResponse(res);
  } catch (err) {
    if (err instanceof TypeError) {
      throw new Error('Cannot reach server. Start the backend on port 8080.');
    }
    throw err;
  }
}

export async function login(username, password) {
  return apiFetch('/api/auth/login', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({ username: username.trim(), password }),
  });
}

export async function register(payload) {
  return apiFetch('/api/auth/register', {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify({
      name: payload.name?.trim(),
      idNumber: payload.idNumber?.trim(),
      phoneNumber: payload.phoneNumber?.trim(),
      username: payload.username?.trim(),
      password: payload.password,
      role: 'customer',
    }),
  });
}

export async function fetchProfile(token) {
  return apiFetch('/api/auth/me', {
    headers: authHeaders(token),
  });
}

export async function fetchFoods(category) {
  return apiFetch(`/api/${category}/foods`);
}

export async function addFood(token, category, food) {
  return apiFetch(`/api/${category}/foods`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(food),
  });
}

export async function placeOrder(token, category, order) {
  return apiFetch(`/api/${category}/orders`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(order),
  });
}

export async function fetchMyOrders(token) {
  const data = await apiFetch('/api/orders', {
    headers: authHeaders(token),
  });

  // Support older backends that returned a plain order array.
  if (Array.isArray(data)) {
    const pending = data.filter((order) => !order.receiptNumber);
    const totalAmount = pending.reduce((sum, order) => sum + (order.total || 0), 0);
    return {
      orders: data,
      bill: {
        items: pending,
        totalAmount,
        itemCount: pending.length,
      },
    };
  }

  return data;
}

export async function fetchBill(token) {
  return apiFetch('/api/orders/bill', {
    headers: authHeaders(token),
  });
}

export async function issueReceipt(token) {
  return apiFetch('/api/orders/receipt', {
    method: 'POST',
    headers: authHeaders(token),
  });
}

export async function fetchReceipt(token, receiptNumber) {
  return apiFetch(`/api/orders/receipt/${encodeURIComponent(receiptNumber)}`, {
    headers: authHeaders(token),
  });
}

export async function sendThankYouSms(token, receiptNumber) {
  return apiFetch(`/api/orders/receipt/${encodeURIComponent(receiptNumber)}/thank-you`, {
    method: 'POST',
    headers: authHeaders(token),
  });
}
