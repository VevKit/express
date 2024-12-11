import { Request, Response } from 'express';
import { logger } from '@/utils/logger';
import type { CreateUserInput } from './schema';
import { ValidationError } from '@/types/error';

async function userExists(_email: string): Promise<boolean> {
  return false; // Mock implementation
}

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

    if (await userExists(userData.email)) {
      throw new ValidationError('User validation failed', [{
        field: 'email',
        message: 'Email already registered'
      }]);
    }
    
    // Skip other semantics (hash password, save to database, etc.) and mock a response
    const user = {
      id: 'mock-id-' + Date.now(),
      ...userData,
      createdAt: new Date().toISOString()
    };

    logger.info('User created successfully', { userId: user.id });
    
    res.status(201).json({
      status: 'success',
      data: { user }
    });
  } catch (error) {
    logger.error('Error creating user', { error });
    res.status(500).json({
      status: 'error',
      message: 'Failed to create user'
    });
  }
}