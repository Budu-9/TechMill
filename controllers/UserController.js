const { body, validationResult } = require('express-validator');
const userService = require('../services/UserService');

class UserController {
  // Validation rules
  static getRegisterValidation() {
    return [
      body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
      body('email').isEmail().withMessage('Please provide a valid email'),
      body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
    ];
  }

  static getLoginValidation() {
    return [
      body('email').isEmail().withMessage('Please provide a valid email'),
      body('password').notEmpty().withMessage('Password is required')
    ];
  }

  async register(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const user = await userService.registerUser(req.body);
      
      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async login(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { email, password } = req.body;
      const result = await userService.loginUser(email, password);
      
      res.json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await userService.getAllUsers();
      
      res.json({
        success: true,
        data: users
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async banUser(req, res) {
    try {
      const { userId } = req.params;
      const result = await userService.banUser(userId);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async unbanUser(req, res) {
    try {
      const { userId } = req.params;
      const result = await userService.unbanUser(userId);
      
      res.json({
        success: true,
        message: result.message
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getProfile(req, res) {
    try {
      const user = await userService.getUserById(req.user.id);
      
      res.json({
        success: true,
        data: user
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new UserController();