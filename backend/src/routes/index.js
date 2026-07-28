import { Router } from 'express';
import healthRoutes from './healthRoutes.js';
import productRoutes from './productRoutes.js';
import categoryRoutes from './categoryRoutes.js';
import authRoutes from './authRoutes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);
router.use('/auth', authRoutes);
export default router;
