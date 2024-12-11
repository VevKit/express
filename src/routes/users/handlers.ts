import { Request, Response } from 'express';
import { logger } from '@/utils/logger';
import type { CreateUserInput } from './schema';

export async function createUser(
  req: Request<{}, {}, CreateUserInput>,
  res: Response
) {
  try {
    const userData = req.body;
    
    logger.debug('Creating new user', { 
      email: userData.email,
      username: userData.username 
    });
    
    // Skip semantics (check if user exists, hash password, save to database, etc.) and mock a response
    res.status(201).json({
      status: 'success',
      data: {
        user: {
          id: 'mock-id-' + Date.now(),
          email: userData.email,
          username: userData.username,
          name: userData.name,
          createdAt: new Date().toISOString()
        }
      }
    });
  } catch (error) {
    logger.error('Error creating user', { error });
    res.status(500).json({
      status: 'error',
      message: 'Failed to create user'
    });
  }
}