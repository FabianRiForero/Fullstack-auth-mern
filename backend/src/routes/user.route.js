import { Router } from 'express';
import { verifyToken } from '../middlewares/VerifyToken.js';
import { refreshToken } from '../controllers/RefreshToken.js';
import { getUsers, login, logout, registerUser } from '../controllers/user.controller.js';
const router = Router();

router.post('/login', login);
router.post('/register', registerUser);
router.get('/users', verifyToken, getUsers);
router.get('/token', refreshToken);
router.delete('/logout', logout);

export default router;