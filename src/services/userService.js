import axios from 'axios';
import { API_BASE_URL } from './constant'; 


const API = axios.create({
  baseURL: API_BASE_URL, 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const fetchUsers = () => API.get('/users'); 
export const createUser = (userData) => API.post('/users', userData); 
export const updateUser = (id, userData) => API.put(`/users/${id}`, userData);
export const deleteUser = (id) => API.delete(`/users/${id}`);
export const loginUser = (credentials) => API.post('/users/login', credentials);