const express = require('express');
const { body } = require('express-validator');
const { register, login, getProfile, updateProfile, assignRole, logout } = require('../controllers/authController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', [
  body('username').notEmpty(),
  body('password').isLength({ min: 6 }),
  body('role').isIn(['admin', 'accountant', 'student'])
], register);

router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile/update', protect, updateProfile);
router.post('/role', protect, authorize('admin'), assignRole);
router.post('/logout', protect, logout);

module.exports = router;