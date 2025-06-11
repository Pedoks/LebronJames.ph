import axios from 'axios';
import { API_BASE_URL } from './constant'; 


const API = axios.create({
  baseURL: API_BASE_URL, 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchUsers = () => API.get('/api/users'); 
export const createUser = (userData) => API.post('/api/users', userData); 
export const updateUser = (id, userData) => API.put(`/api/users/${id}`, userData);
export const deleteUser = (id) => API.delete(`/api/users/${id}`);
export const loginUser = (credentials) => API.post('/api/users/login', credentials);