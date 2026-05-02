# Developer Guide for Moul L7anout

This guide provides comprehensive information for developers working on the Moul L7anout platform.

## Architecture Overview

Moul L7anout follows a **client-server architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend (Next.js)                       │
│  - React 19 components                                      │
│  - TailwindCSS styling                                      │
│  - React Query for data fetching                            │
│  - TypeScript for type safety                               │
└─────────────────────────────────────────────────────────────┘
                            ↓ HTTP/REST
┌─────────────────────────────────────────────────────────────┐
│                  Backend (Express/Node.js)                   │
│  - Controllers (business logic)                             │
│  - Services (data operations)                               │
│  - Models (Mongoose schemas)                                │
│  - Middleware (auth, validation, error handling)            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Data Layer                                 │
│  - MongoDB (primary database)                               │
│  - Redis (caching & queues)                                 │
│  - Socket.IO (real-time communication)                      │
└─────────────────────────────────────────────────────────────┘
```

## Backend Architecture

### Directory Structure

```
backend/src/
├── controllers/        # Route handlers (receive requests, call services)
├── models/            # Mongoose schemas (data models)
├── routes/            # Express routes (URL mappings)
├── middleware/        # Auth, logging, validation
├── services/          # Business logic (reusable functions)
├── database/          # MongoDB connection
├── config/            # Configuration (env, database, etc.)
├── utils/             # Helper functions
├── validators/        # Input validation schemas
├── types/             # TypeScript interfaces
├── jobs/              # Background jobs (queued tasks)
├── sockets/           # WebSocket handlers
├── queues/            # BullMQ queue definitions
├── templates/         # Email templates
└── index.ts           # Entry point
```

### Adding a New API Endpoint

**Step 1: Create a Controller**

```typescript
// backend/src/controllers/exampleController.ts
import { Request, Response } from 'express';
import { Example } from '../models/Example';

export const getExample = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const example = await Example.findById(id);
    
    if (!example) {
      return res.status(404).json({
        success: false,
        message: 'Example not found',
      });
    }

    res.json({
      success: true,
      data: example,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch example',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
```

**Step 2: Add a Route**

```typescript
// backend/src/routes/index.ts
import * as exampleController from '../controllers/exampleController';

router.get('/examples/:id', exampleController.getExample);
```

**Step 3: Create a Model (if needed)**

```typescript
// backend/src/models/Example.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface IExample extends Document {
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const exampleSchema = new Schema<IExample>(
  {
    name: { type: String, required: true },
    description: { type: String },
  },
  { timestamps: true }
);

export const Example = mongoose.model<IExample>('Example', exampleSchema);
```

**Step 4: Update Frontend Endpoints**

```typescript
// frontend/lib/api/endpoints.ts
export const examplesApi = {
  getById: (id: string) => 
    apiClient.get<IExample>(`/v1/examples/${id}`),
};
```

## Frontend Architecture

### Directory Structure

```
frontend/
├── app/               # Next.js App Router (pages)
│   ├── auth/         # Authentication pages
│   ├── buyer/        # Buyer-specific pages
│   ├── seller/       # Seller-specific pages
│   ├── admin/        # Admin pages
│   └── page.tsx      # Root page
├── components/        # React components
│   ├── shared/       # Shared components (navigation, etc.)
│   ├── buyer/        # Buyer-specific components
│   ├── seller/       # Seller-specific components
│   └── ui/           # Basic UI components
├── lib/
│   ├── api/          # API client and endpoints
│   ├── hooks/        # Custom React hooks
│   ├── types/        # TypeScript types
│   ├── config/       # Configuration
│   └── utils/        # Utility functions
├── contexts/         # React contexts (auth, theme, etc.)
├── public/           # Static assets
└── styles/           # Global styles
```

### Adding a New Frontend Page

**Step 1: Create a Page Component**

```typescript
// frontend/app/buyer/example/page.tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { examplesApi } from '@/lib/api/endpoints';

export default function ExamplePage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['example'],
    queryFn: () => examplesApi.getById('123'),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{data?.data?.name}</h1>
    </div>
  );
}
```

**Step 2: Add Navigation**

Update `BottomTabBar` or relevant navigation component to include the new page.

**Step 3: Create Reusable Components (if needed)**

```typescript
// frontend/components/buyer/ExampleCard.tsx
import { IExample } from '@/lib/types/api.types';

export default function ExampleCard({ example }: { example: IExample }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow">
      <h3 className="font-bold">{example.name}</h3>
      <p className="text-gray-600">{example.description}</p>
    </div>
  );
}
```

## Environment Variables

### Backend

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://mongodb:27017/moul_l7anout
REDIS_URL=redis://redis:6379
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=1h
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key
JWT_REFRESH_EXPIRE=7d
```

### Frontend

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
NEXT_PUBLIC_WS_URL=ws://localhost:5000
NEXT_PUBLIC_USE_MOCK=false
```

## Database Schema

### Key Collections

1. **Users**: Stores buyer, seller, delivery, and admin profiles
2. **Stores**: Location-based store information with geospatial indexing
3. **Products**: Product catalog for each store
4. **Orders**: Order records with payment and delivery information
5. **QRCodes**: QR code tokens for transaction fulfillment
6. **LkridiRecords**: Trust-based loan transaction records

All collections include `createdAt` and `updatedAt` timestamps.

## Authentication Flow

1. **User Registration**: Phone + OTP verification
2. **Login**: Phone + OTP → JWT token issued
3. **Token Storage**: JWT stored in localStorage
4. **Protected Routes**: Auth middleware validates token on backend
5. **Token Refresh**: Refresh token endpoint for extending sessions

## Real-Time Features

### WebSocket Events

- **Location Updates**: Moving kiosk position broadcasts
- **Order Status**: Real-time order status changes
- **Chat Messages**: Instant messaging between buyers and sellers
- **Notifications**: Push notifications for order updates

## Troubleshooting

### Docker Issues

**Problem**: Container fails to start
```bash
# Check logs
docker-compose logs backend

# Rebuild containers
docker-compose down
docker-compose build --no-cache
docker-compose up
```

**Problem**: MongoDB connection error
```bash
# Ensure MongoDB is running
docker-compose ps

# Check MongoDB logs
docker-compose logs mongodb
```

### API Issues

**Problem**: CORS errors
- Verify CORS configuration in `backend/src/index.ts`
- Ensure frontend URL is in the allowed origins list

**Problem**: 404 errors on API calls
- Check that routes are properly registered in `backend/src/routes/index.ts`
- Verify endpoint paths match between frontend and backend

### Frontend Issues

**Problem**: Components not rendering
- Check browser console for errors
- Verify React Query is properly configured
- Ensure API client is correctly initialized

## Performance Optimization

1. **Database Indexing**: Add indexes for frequently queried fields
2. **Caching**: Use Redis for frequently accessed data
3. **Pagination**: Implement pagination for large result sets
4. **Lazy Loading**: Load components and data on demand
5. **Image Optimization**: Use Next.js Image component

## Security Best Practices

1. **Environment Variables**: Never commit secrets to git
2. **Input Validation**: Validate all user inputs on both frontend and backend
3. **Authentication**: Use JWT with secure expiration times
4. **HTTPS**: Use HTTPS in production
5. **Rate Limiting**: Implement rate limiting on API endpoints
6. **CORS**: Restrict CORS to trusted origins only

## Testing

### Running Tests

```bash
# Backend tests
cd backend
npm run test

# Frontend tests
cd frontend
npm run test
```

### Writing Tests

```typescript
// Example test
describe('getUserById', () => {
  it('should return a user by ID', async () => {
    const userId = 'test-id';
    const result = await getUserById(userId);
    expect(result).toBeDefined();
    expect(result.id).toBe(userId);
  });
});
```

## Deployment

### Production Checklist

- [ ] Environment variables configured
- [ ] Database backups enabled
- [ ] HTTPS certificates installed
- [ ] Rate limiting configured
- [ ] Monitoring and logging set up
- [ ] Error tracking (Sentry) configured
- [ ] CDN for static assets configured

---

For more information, see the main [README.md](../README.md) or [CONTRIBUTING.md](../CONTRIBUTING.md).
