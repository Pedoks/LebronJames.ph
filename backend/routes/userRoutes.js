const express = require('express');
// Import functions
const { 
  getUsers, 
  createUser, 
  updateUser, 
  deleteUser, 
  loginUser 
} = require('../controllers/userController');

const router = express.Router();

// Routes
router.route('/')
  .get(getUsers)
  .post(createUser);

router.route('/:id')
  .put(updateUser)
  .delete(deleteUser);

router.post('/login', loginUser);

module.exports = router;