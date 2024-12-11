import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string()
      .email('Invalid email address')
      .min(5, 'Email must be at least 5 characters')
      .max(100, 'Email must not exceed 100 characters'),
    username: z.string()
      .min(3, 'Username must be at least 3 characters')
      .max(50, 'Username must not exceed 50 characters')
      .regex(/^[a-zA-Z0-9_-]+$/, 'Username can only contain letters, numbers, underscores, and hyphens'),
    name: z.object({
      first: z.string()
        .min(2, 'First name must be at least 2 characters')
        .max(50, 'First name must not exceed 50 characters'),
      last: z.string()
        .min(2, 'Last name must be at least 2 characters')
        .max(50, 'Last name must not exceed 50 characters'),
    }),
    age: z.number()
      .int('Age must be an integer')
      .min(13, 'Must be at least 13 years old')
      .max(120, 'Invalid age'),
  }),
  query: z.object({}).optional(),
  params: z.object({}).optional(),
});

export type CreateUserInput = z.infer<typeof createUserSchema>['body'];