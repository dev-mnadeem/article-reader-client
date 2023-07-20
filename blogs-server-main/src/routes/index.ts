import express from 'express';
import authRoutes from './users';
import postsRoutes from './posts';

// Creating router
const router = express.Router();

// Mounting auth routes
router.use('/auth', authRoutes);

// Mounting posts routes
router.use('/posts', postsRoutes);

export default router;
