import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

// Read endpoints are public.
router.get('/', getProducts);
router.get('/:id', getProductById);

// Write endpoints require an authenticated administrator.
router.post('/', requireAuth, createProduct);
router.put('/:id', requireAuth, updateProduct);
router.delete('/:id', requireAuth, deleteProduct);

export default router;
