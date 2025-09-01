const { body, validationResult } = require('express-validator');
const productService = require('../services/ProductService');

class ProductController {
  // Validation rules
  static getProductValidation() {
    return [
      body('name').trim().isLength({ min: 2 }).withMessage('Product name must be at least 2 characters'),
      body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
      body('quantity').isInt({ min: 0 }).withMessage('Quantity must be a non-negative integer'),
      body('description').optional().trim()
    ];
  }

  async createProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const product = await productService.createProduct(req.body, req.user.id);
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async getMyProducts(req, res) {
    try {
      const products = await productService.getProductsByUser(req.user.id);
      
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async updateProduct(req, res) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array()
        });
      }

      const { productId } = req.params;
      const product = await productService.updateProduct(productId, req.body, req.user.id);
      
      res.json({
        success: true,
        message: 'Product updated successfully',
        data: product
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message
      });
    }
  }

  async deleteProduct(req, res) {
    try {
      const { productId } = req.params;
      const result = await productService.deleteProduct(productId, req.user.id);
      
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

  async getApprovedProducts(req, res) {
    try {
      const products = await productService.getApprovedProducts();
      
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async getAllProductsForAdmin(req, res) {
    try {
      const products = await productService.getAllProductsForAdmin();
      
      res.json({
        success: true,
        data: products
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message
      });
    }
  }

  async approveProduct(req, res) {
    try {
      const { productId } = req.params;
      const result = await productService.approveProduct(productId);
      
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

  async disapproveProduct(req, res) {
    try {
      const { productId } = req.params;
      const result = await productService.disapproveProduct(productId);
      
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

  async getProductById(req, res) {
    try {
      const { productId } = req.params;
      const product = await productService.getProductById(productId);
      
      res.json({
        success: true,
        data: product
      });
    } catch (error) {
      res.status(404).json({
        success: false,
        message: error.message
      });
    }
  }
}

module.exports = new ProductController();