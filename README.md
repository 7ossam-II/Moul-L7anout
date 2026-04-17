# Moul L7anout

**A Location-Based E-Commerce Platform for the Moroccan Market**

## Overview

Moul L7anout is a modern, location-based e-commerce and service platform designed specifically for the Moroccan market. It connects local sellers (fixed stores, moving food trucks, kiosks) with nearby buyers, featuring unique capabilities like real-time location tracking, QR-code-based fulfillment, and a trust-based loan system called **LKRIDI**.

## Key Features

- **Multi-Payment Models**: Online (card/escrow), offline cash, and trust-based LKRIDI loans
- **Real-Time Location Tracking**: Track moving kiosks and food trucks in real-time
- **QR-Code Fulfillment**: Dual-confirmation (buyer + seller) for transaction completion
- **Geospatial Discovery**: Find nearby stores within a specified radius
- **Seller Dashboard**: Manage inventory, orders, and loan records
- **Buyer App**: Map discovery, store pages, and streamlined checkout
- **Multi-Language Support**: Arabic, Darija, French, and English

## Tech Stack

| Component | Technology |
|-----------|------------|
| **Frontend** | Next.js 16, React 19, TypeScript, TailwindCSS, React Query |
| **Backend** | Node.js, Express, TypeScript |
| **Database** | MongoDB with Mongoose ODM |
| **Cache/Queue** | Redis, BullMQ |
| **Real-Time** | WebSockets (Socket.IO) |
| **Containerization** | Docker, Docker Compose |

## Prerequisites

- **Docker** and **Docker Compose** (recommended)
- **Node.js 20+** (if running locally without Docker)
- **npm** or **pnpm**

## Quick Start

### Option 1: Using Docker (Recommended)

1. **Clone the repository**:
   ```bash
   git clone https://github.com/7ossam-II/Moul-L7anout.git
   cd Moul-L7anout
   ```

2. **Copy environment variables**:
   ```bash
   cp .env.example .env
   ```

3. **Start the services**:
   ```bash
   docker-compose up
   ```

4. **Access the application**:
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:5000/api`
   - Health Check: `http://localhost:5000/api/health`

### Option 2: Local Development

1. **Install dependencies**:
   ```bash
   cd backend && npm install
   cd ../frontend && npm install
   ```

2. **Configure environment**:
   ```bash
   cp .env.example .env
   ```

3. **Start MongoDB and Redis** (ensure they are running locally)

4. **Run the backend**:
   ```bash
   cd backend
   npm run dev
   ```

5. **Run the frontend** (in another terminal):
   ```bash
   cd frontend
   npm run dev
   ```

## Project Structure

```
Moul-L7anout/
├── backend/
│   ├── src/
│   │   ├── controllers/        # API route handlers
│   │   ├── models/             # Mongoose schemas
│   │   ├── routes/             # Express routes
│   │   ├── middleware/         # Auth, logging, etc.
│   │   ├── services/           # Business logic
│   │   ├── database/           # MongoDB connection
│   │   ├── config/             # Configuration files
│   │   └── index.ts            # Entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── Dockerfile
├── frontend/
│   ├── app/                    # Next.js App Router
│   ├── components/             # React components
│   ├── lib/
│   │   ├── api/                # API client and endpoints
│   │   ├── hooks/              # Custom React hooks
│   │   └── types/              # TypeScript types
│   ├── package.json
│   ├── tailwind.config.js
│   └── Dockerfile
├── docker-compose.yml
├── .env.example
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` – Register a new user
- `POST /api/auth/login` – Login with phone number
- `GET /api/auth/me` – Get current user (requires auth)

### Stores
- `GET /api/stores/nearby?lat=X&lng=Y&radius=5000` – Get nearby stores
- `GET /api/stores/:storeId` – Get store details
- `POST /api/stores` – Create a new store (requires auth)

### Products
- `GET /api/stores/:storeId/products` – Get products by store
- `GET /api/products/:productId` – Get product details
- `POST /api/products` – Create a product (requires auth)

### Orders
- `POST /api/orders` – Create an order (requires auth)
- `GET /api/orders/:orderId` – Get order details (requires auth)
- `GET /api/orders` – Get user's orders (requires auth)

## Environment Variables

See `.env.example` for all available variables. Key variables include:

```env
MONGODB_URI=mongodb://mongodb:27017/moul_l7anout
REDIS_URL=redis://redis:6379
JWT_SECRET=your_jwt_secret_key
PORT=5000
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:
- Git workflow and branch strategy
- Commit message format
- Pull request process
- Code style guidelines

## Documentation

- [Developer Guide](./docs/DEVELOPER_GUIDE.md) – Architecture, adding endpoints, troubleshooting
- [API Reference](./docs/API_REFERENCE.md) – Detailed API documentation
- [Contributing Guide](./CONTRIBUTING.md) – How to contribute to the project

## Support

For issues, questions, or suggestions, please open an issue on GitHub or contact the development team.

## License

This project is licensed under the MIT License – see the LICENSE file for details.

---

**Built with ❤️ for the Moroccan market**
