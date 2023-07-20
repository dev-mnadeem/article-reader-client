import express from 'express';
import { addPost, getPosts } from '../controllers/posts';
import exceptionHandler from '../helpers/exceptionHelper';
import authenticateToken from '../middlewares/authMiddleware';

const router = express.Router();

router.get('/', authenticateToken, exceptionHandler(getPosts));
router.post('/', authenticateToken, exceptionHandler(addPost));

export default router;
