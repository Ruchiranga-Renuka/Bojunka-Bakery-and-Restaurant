import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const api = axios.create({ baseURL: API_BASE });

export function setToken(token){
  api.defaults.headers.common['Authorization'] = token ? `Bearer ${token}` : undefined;
}

export default api;
