const express = require('express');
const userController = require('../controllers/UserController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.post('/register', userController.constructor.getRegisterValidation(), userController.register);
router.post('/login', userController.constructor.getLoginValidation(), userController.login);

// Protected routes (authenticated users)
router.get('/profile', authenticateToken, userController.getProfile);

// Admin only routes
router.get('/', authenticateToken, requireRole('admin'), userController.getAllUsers);
router.put('/:userId/ban', authenticateToken, requireRole('admin'), userController.banUser);
router.put('/:userId/unban', authenticateToken, requireRole('admin'), userController.unbanUser);

module.exports = router;