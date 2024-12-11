import { Router } from 'express';
import { createUser } from './handlers';
import { validateRequest } from '@/middleware/validation';
import { createUserSchema } from './schema';

const router = Router();

router.post(
  '/',
  validateRequest(createUserSchema),
  createUser
);

export const userRoutes = router;