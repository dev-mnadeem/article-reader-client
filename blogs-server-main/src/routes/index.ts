import express from 'express';
import { getHealth } from '../controllers/health';
import postsRoutes from './posts';
import authRoutes from './users';

const router = express.Router();

router.get('/health', getHealth);
router.use('/auth', authRoutes);
router.use('/posts', postsRoutes);

export default router;
