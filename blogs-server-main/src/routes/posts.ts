import express from 'express';
import { addPost, getPosts } from '../controllers/posts';
import exceptionHandler from '../helpers/exceptionHelper';
import authenticateToken from '../middlewares/authMiddleware';

// Creating router
const router = express.Router();

// Route to get posts
router.get('/', authenticateToken, exceptionHandler(getPosts));

// Route to add post
router.post('/', authenticateToken, exceptionHandler(addPost));

export default router;
