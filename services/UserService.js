const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { getConnection } = require('../config/database');

class UserService {
  async registerUser(userData) {
    const connection = getConnection();
    const { name, email, password } = userData;

    try {
      // Check if user already exists
      const [existingUsers] = await connection.execute(
        'SELECT id FROM users WHERE email = ?',
        [email]
      );

      if (existingUsers.length > 0) {
        throw new Error('User with this email already exists');
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(password, 12);

      // Insert user
      const [result] = await connection.execute(
        'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
        [name, email, hashedPassword]
      );

      // Get created user (without password)
      const [newUser] = await connection.execute(
        'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
        [result.insertId]
      );

      return newUser[0];
    } catch (error) {
      throw error;
    }
  }

  async loginUser(email, password) {
    const connection = getConnection();

    try {
      // Get user with password
      const [users] = await connection.execute(
        'SELECT id, name, email, password, role, status FROM users WHERE email = ?',
        [email]
      );

      if (users.length === 0) {
        throw new Error('Invalid email or password');
      }

      const user = users[0];

      // Check if user is banned
      if (user.status === 'banned') {
        throw new Error('User account is banned');
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid email or password');
      }

      // Generate JWT token
      const token = jwt.sign(
        { userId: user.id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Return user data without password
      const { password: _, ...userWithoutPassword } = user;
      return { user: userWithoutPassword, token };
    } catch (error) {
      throw error;
    }
  }

  async getAllUsers() {
    const connection = getConnection();

    try {
      const [users] = await connection.execute(
        'SELECT id, name, email, role, status, created_at FROM users ORDER BY created_at DESC'
      );
      return users;
    } catch (error) {
      throw error;
    }
  }

  async banUser(userId) {
    const connection = getConnection();

    try {
      const [result] = await connection.execute(
        'UPDATE users SET status = "banned" WHERE id = ? AND role != "admin"',
        [userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('User not found or cannot ban admin users');
      }

      return { message: 'User banned successfully' };
    } catch (error) {
      throw error;
    }
  }

  async unbanUser(userId) {
    const connection = getConnection();

    try {
      const [result] = await connection.execute(
        'UPDATE users SET status = "active" WHERE id = ?',
        [userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('User not found');
      }

      return { message: 'User unbanned successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getUserById(userId) {
    const connection = getConnection();

    try {
      const [users] = await connection.execute(
        'SELECT id, name, email, role, status, created_at FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        throw new Error('User not found');
      }

      return users[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new UserService();