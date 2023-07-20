import express from 'express';
import { handleLogin, handleSignup } from '../controllers/users';
import exceptionHandler from '../helpers/exceptionHelper';

// Creating router
const router = express.Router();

// Route for user signup
router.post('/signup', exceptionHandler(handleSignup));

// Route for user login
router.post('/login', exceptionHandler(handleLogin));

export default router;
