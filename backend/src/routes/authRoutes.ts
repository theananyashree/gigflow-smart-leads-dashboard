import { Router } from 'express';
import { register, login, getMe, getAllUsers } from '../controllers/authController';
import { authenticate, authorizeRoles } from '../middleware/auth';
import { registerValidator, loginValidator } from '../validators/authValidators';
import { validate } from '../middleware/validate';
import { UserRole } from '../types';

const router = Router();

router.post('/register', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);
router.get('/me', authenticate, getMe);
router.get('/users', authenticate, authorizeRoles(UserRole.ADMIN), getAllUsers);

export default router;