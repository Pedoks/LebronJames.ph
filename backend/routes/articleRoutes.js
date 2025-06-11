const express = require('express');
const router = express.Router();
const {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
} = require('../controllers/articleController');

// GET /api/articles - Get all articles
router.get('/', getArticles);

// GET /api/articles/:id - Get single article
router.get('/:id', getArticleById);

// POST /api/articles - Create new article
router.post('/', createArticle);

// PUT /api/articles/:id - Update article
router.put('/:id', updateArticle);

// DELETE /api/articles/:id - Delete article
router.delete('/:id', deleteArticle);

module.exports = router;