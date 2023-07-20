import express from 'express';
import postsRoutes from './posts';
import authRoutes from './users';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/posts', postsRoutes);

export default router;
