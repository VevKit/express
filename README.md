# @vevkit/express

A lightweight, TypeScript-based Express server boilerplate that aligns with VevKit's philosophy of removing friction between idea and implementation.

## Features

- 🚀 Immediate productivity with minimal setup
- 📝 TypeScript support
- 🛡️ Built-in security features
- ✅ Request validation with Zod
- 🔄 Comprehensive error handling
- 📊 Logging with @vevkit/saga
- ⏱️ Request timeout handling
- 🔒 CORS configuration

## Quick Start

```bash
# Clone the repository
git clone https://github.com/vevkit/express.git my-project

# Enter project directory
cd my-project

# Install dependencies
npm install

# Start development server
npm run dev
```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
src/
  ├── config/             # Configuration files
  ├── middleware/         # Custom middleware
  ├── routes/            # API routes
  ├── types/             # TypeScript type definitions
  ├── utils/             # Utility functions
  └── server.ts          # Server entry point
```

## Environment Variables

Create a `.env` file in the root directory:

```env
NODE_ENV=development
PORT=3000
CORS_ORIGIN=http://localhost:5173
```

## API Example

```typescript
// src/routes/users/index.ts
import { Router } from 'express';
import { validateRequest } from '@/middleware/validation';
import { createUserSchema } from './schema';

const router = Router();

router.post(
  '/',
  validateRequest(createUserSchema),
  createUser
);

export const userRoutes = router;
```

## Validation Example

```typescript
// src/routes/users/schema.ts
import { z } from 'zod';

export const createUserSchema = z.object({
  body: z.object({
    email: z.string().email(),
    username: z.string().min(3),
    name: z.string()
  })
});
```

## Error Handling

The boilerplate includes a comprehensive error handling system:

- Validation errors
- Request timeout errors
- Operational errors
- Development/production appropriate responses

## Security Features

- Helmet security headers
- Rate limiting
- Request size limits
- CORS configuration
- XSS protection
- Request timeouts

## Contributing

Contributions are welcome! Please read our contributing guidelines for details.

## License

MIT

## Acknowledgments

This boilerplate is part of the VevKit ecosystem, designed to provide immediate productivity while maintaining flexibility for future growth.