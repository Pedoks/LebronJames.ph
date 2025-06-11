const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: { type: String, required: false }, // Changed to optional
  gender: { type: String, required: false }, // Changed to optional
  contactNumber: { type: String, required: false }, // Changed to optional
  email: { type: String, required: true, unique: true },
  type: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'editor' },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: false }, // Changed to optional
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true // Add timestamps for createdAt and updatedAt
});

// Pre-save middleware to generate username if not provided
userSchema.pre('save', function(next) {
  if (!this.username) {
    // Generate username from email (part before @)
    this.username = this.email.split('@')[0];
  }
  next();
});

module.exports = mongoose.model('User', userSchema);