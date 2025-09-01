const { getConnection } = require('../config/database');

class ProductService {
  async createProduct(productData, userId) {
    const connection = getConnection();
    const { name, price, quantity, description } = productData;

    try {
      const [result] = await connection.execute(
        'INSERT INTO products (name, price, quantity, description, user_id) VALUES (?, ?, ?, ?, ?)',
        [name, price, quantity, description, userId]
      );

      // Get created product
      const [newProduct] = await connection.execute(
        `SELECT p.*, u.name as owner_name 
         FROM products p 
         JOIN users u ON p.user_id = u.id 
         WHERE p.id = ?`,
        [result.insertId]
      );

      return newProduct[0];
    } catch (error) {
      throw error;
    }
  }

  async getProductsByUser(userId) {
    const connection = getConnection();

    try {
      const [products] = await connection.execute(
        'SELECT * FROM products WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return products;
    } catch (error) {
      throw error;
    }
  }

  async updateProduct(productId, productData, userId) {
    const connection = getConnection();
    const { name, price, quantity, description } = productData;

    try {
      // Check if product belongs to user
      const [existingProducts] = await connection.execute(
        'SELECT id FROM products WHERE id = ? AND user_id = ?',
        [productId, userId]
      );

      if (existingProducts.length === 0) {
        throw new Error('Product not found or you do not have permission to update it');
      }

      const [result] = await connection.execute(
        'UPDATE products SET name = ?, price = ?, quantity = ?, description = ?, status = "pending" WHERE id = ? AND user_id = ?',
        [name, price, quantity, description, productId, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Failed to update product');
      }

      // Get updated product
      const [updatedProduct] = await connection.execute(
        `SELECT p.*, u.name as owner_name 
         FROM products p 
         JOIN users u ON p.user_id = u.id 
         WHERE p.id = ?`,
        [productId]
      );

      return updatedProduct[0];
    } catch (error) {
      throw error;
    }
  }

  async deleteProduct(productId, userId) {
    const connection = getConnection();

    try {
      const [result] = await connection.execute(
        'DELETE FROM products WHERE id = ? AND user_id = ?',
        [productId, userId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Product not found or you do not have permission to delete it');
      }

      return { message: 'Product deleted successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getApprovedProducts() {
    const connection = getConnection();

    try {
      const [products] = await connection.execute(
        `SELECT p.id, p.name, p.price, p.quantity, p.description, p.created_at, u.name as owner_name
         FROM products p 
         JOIN users u ON p.user_id = u.id 
         WHERE p.status = "approved" 
         ORDER BY p.created_at DESC`
      );
      return products;
    } catch (error) {
      throw error;
    }
  }

  async getAllProductsForAdmin() {
    const connection = getConnection();

    try {
      const [products] = await connection.execute(
        `SELECT p.*, u.name as owner_name, u.email as owner_email
         FROM products p 
         JOIN users u ON p.user_id = u.id 
         ORDER BY p.created_at DESC`
      );
      return products;
    } catch (error) {
      throw error;
    }
  }

  async approveProduct(productId) {
    const connection = getConnection();

    try {
      const [result] = await connection.execute(
        'UPDATE products SET status = "approved" WHERE id = ?',
        [productId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Product not found');
      }

      return { message: 'Product approved successfully' };
    } catch (error) {
      throw error;
    }
  }

  async disapproveProduct(productId) {
    const connection = getConnection();

    try {
      const [result] = await connection.execute(
        'UPDATE products SET status = "disapproved" WHERE id = ?',
        [productId]
      );

      if (result.affectedRows === 0) {
        throw new Error('Product not found');
      }

      return { message: 'Product disapproved successfully' };
    } catch (error) {
      throw error;
    }
  }

  async getProductById(productId) {
    const connection = getConnection();

    try {
      const [products] = await connection.execute(
        `SELECT p.*, u.name as owner_name 
         FROM products p 
         JOIN users u ON p.user_id = u.id 
         WHERE p.id = ?`,
        [productId]
      );

      if (products.length === 0) {
        throw new Error('Product not found');
      }

      return products[0];
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new ProductService();