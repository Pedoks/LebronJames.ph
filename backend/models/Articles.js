const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  articleName: {
    type: String,
    required: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  text: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    trim: true,
    default: null
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Article', articleSchema);