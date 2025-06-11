const Article = require('../models/Articles');

// Get all articles
const getArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ createdAt: -1 });
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching articles', error: error.message });
  }
};

// Get single article by ID
const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(404).json({ message: 'Article not found' });
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching article', error: error.message });
  }
};

// Create new article
const createArticle = async (req, res) => {
  try {
    const { articleName, title, text, author, image, status } = req.body;

    // Validation
    if (!articleName || !title || !text || !author) {
      return res.status(400).json({ 
        message: 'Please provide all required fields: articleName, title, text, author' 
      });
    }

    const newArticle = new Article({
      articleName,
      title,
      text,
      author,
      image: image || null,
      status: status || 'active'
    });

    const savedArticle = await newArticle.save();
    res.status(201).json(savedArticle);
  } catch (error) {
    res.status(500).json({ message: 'Error creating article', error: error.message });
  }
};

// Update article
const updateArticle = async (req, res) => {
  try {
    const { articleName, title, text, author, image, status } = req.body;

    const updatedArticle = await Article.findByIdAndUpdate(
      req.params.id,
      { articleName, title, text, author, image, status },
      { new: true, runValidators: true }
    );

    if (!updatedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ message: 'Error updating article', error: error.message });
  }
};

// Delete article
const deleteArticle = async (req, res) => {
  try {
    const deletedArticle = await Article.findByIdAndDelete(req.params.id);
    
    if (!deletedArticle) {
      return res.status(404).json({ message: 'Article not found' });
    }

    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting article', error: error.message });
  }
};

module.exports = {
  getArticles,
  getArticleById,
  createArticle,
  updateArticle,
  deleteArticle
};