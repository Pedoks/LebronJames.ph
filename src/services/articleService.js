import axios from 'axios';
import { API_BASE_URL } from './constant';

const API = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get all articles
export const fetchArticles = () => API.get('/articles');

// Get single article
export const fetchArticleById = (id) => API.get(`/articles/${id}`);

// Create new article
export const createArticle = (articleData) => API.post('/articles', articleData);

// Update article
export const updateArticle = (id, articleData) => API.put(`/articles/${id}`, articleData);

// Delete article
export const deleteArticle = (id) => API.delete(`/articles/${id}`);