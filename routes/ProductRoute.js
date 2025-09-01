const express = require('express');
const productController = require('../controllers/ProductController');
const { authenticateToken, requireRole } = require('../middleware/auth');

const router = express.Router();

// Public routes (unauthenticated users can view approved products)
router.get('/approved', productController.getApprovedProducts);
router.get('/:productId/public', productController.getProductById);

// Protected routes (authenticated users)
router.post('/', authenticateToken, productController.constructor.getProductValidation(), productController.createProduct);
router.get('/my-products', authenticateToken, productController.getMyProducts);
router.put('/:productId', authenticateToken, productController.constructor.getProductValidation(), productController.updateProduct);
router.delete('/:productId', authenticateToken, productController.deleteProduct);

// Admin only routes
router.get('/admin/all', authenticateToken, requireRole('admin'), productController.getAllProductsForAdmin);
router.put('/:productId/approve', authenticateToken, requireRole('admin'), productController.approveProduct);
router.put('/:productId/disapprove', authenticateToken, requireRole('admin'), productController.disapproveProduct);

module.exports = router;