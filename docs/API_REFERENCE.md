# API Reference

This document provides a comprehensive reference for all available API endpoints in Moul L7anout.

## Base URL

```
http://localhost:5000/api
```

## Authentication

Most endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <token>
```

## Response Format

All responses follow a consistent format:

```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* response data */ }
}
```

## Endpoints

### Authentication

#### Register

Create a new user account.

**Request**
```
POST /auth/register
Content-Type: application/json

{
  "phone": "+212612345678",
  "name": "John Doe",
  "role": "buyer"
}
```

**Response**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "phone": "+212612345678",
      "name": "John Doe",
      "role": "buyer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Login

Authenticate with phone number.

**Request**
```
POST /auth/login
Content-Type: application/json

{
  "phone": "+212612345678"
}
```

**Response**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": {
      "id": "507f1f77bcf86cd799439011",
      "phone": "+212612345678",
      "name": "John Doe",
      "role": "buyer"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

#### Get Current User

Retrieve the authenticated user's profile.

**Request**
```
GET /auth/me
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "data": {
    "id": "507f1f77bcf86cd799439011",
    "phone": "+212612345678",
    "name": "John Doe",
    "role": "buyer",
    "isVerified": true
  }
}
```

### Stores

#### Get Nearby Stores

Retrieve stores near a specific location.

**Request**
```
GET /stores/nearby?lat=33.9716&lng=-6.8498&radius=5000
```

**Query Parameters**
- `lat` (required): Latitude
- `lng` (required): Longitude
- `radius` (optional): Search radius in meters (default: 5000)

**Response**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "name": "Fresh Market",
      "address": "123 Market Street",
      "location": {
        "type": "Point",
        "coordinates": [-6.8498, 33.9716]
      },
      "phone": "+212612345678",
      "categories": ["Groceries", "Fresh Food"],
      "isOpen": true,
      "rating": 4.5,
      "reviewCount": 128,
      "deliveryEnabled": true,
      "deliveryFee": 2.99,
      "lkridiEnabled": true,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Get Store Details

Retrieve detailed information about a specific store.

**Request**
```
GET /stores/:storeId
```

**Response**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Fresh Market",
    "description": "Your local fresh grocery store",
    "address": "123 Market Street",
    "location": {
      "type": "Point",
      "coordinates": [-6.8498, 33.9716]
    },
    "phone": "+212612345678",
    "email": "fresh@market.com",
    "logo": "https://example.com/logo.png",
    "categories": ["Groceries", "Fresh Food"],
    "isOpen": true,
    "rating": 4.5,
    "reviewCount": 128,
    "deliveryEnabled": true,
    "deliveryFee": 2.99,
    "lkridiEnabled": true,
    "liveTrackingEnabled": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Create Store

Create a new store (requires authentication).

**Request**
```
POST /stores
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Fresh Market",
  "address": "123 Market Street",
  "lat": 33.9716,
  "lng": -6.8498,
  "phone": "+212612345678",
  "categories": ["Groceries", "Fresh Food"]
}
```

**Response**
```json
{
  "success": true,
  "message": "Store created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Fresh Market",
    "address": "123 Market Street",
    "location": {
      "type": "Point",
      "coordinates": [-6.8498, 33.9716]
    },
    "phone": "+212612345678",
    "categories": ["Groceries", "Fresh Food"],
    "isOpen": true,
    "rating": 0,
    "reviewCount": 0,
    "deliveryEnabled": false,
    "lkridiEnabled": false,
    "liveTrackingEnabled": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Products

#### Get Products by Store

Retrieve all products for a specific store.

**Request**
```
GET /stores/:storeId/products
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439013",
      "storeId": "507f1f77bcf86cd799439011",
      "name": "Organic Apples",
      "description": "Fresh organic apples from local farms",
      "price": 4.99,
      "discountPrice": 3.99,
      "images": ["https://example.com/apple.jpg"],
      "category": "Fruits",
      "subcategory": "Apples",
      "inStock": true,
      "quantity": 50,
      "deliveryEnabled": true,
      "maxDeliveryQuantity": 100,
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

#### Get Product Details

Retrieve detailed information about a specific product.

**Request**
```
GET /products/:productId
```

**Response**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "storeId": "507f1f77bcf86cd799439011",
    "name": "Organic Apples",
    "description": "Fresh organic apples from local farms",
    "price": 4.99,
    "discountPrice": 3.99,
    "images": ["https://example.com/apple.jpg"],
    "category": "Fruits",
    "subcategory": "Apples",
    "inStock": true,
    "quantity": 50,
    "deliveryEnabled": true,
    "maxDeliveryQuantity": 100,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Create Product

Create a new product (requires authentication).

**Request**
```
POST /products
Authorization: Bearer <token>
Content-Type: application/json

{
  "storeId": "507f1f77bcf86cd799439011",
  "name": "Organic Apples",
  "price": 4.99,
  "category": "Fruits",
  "description": "Fresh organic apples from local farms"
}
```

**Response**
```json
{
  "success": true,
  "message": "Product created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439013",
    "storeId": "507f1f77bcf86cd799439011",
    "name": "Organic Apples",
    "price": 4.99,
    "category": "Fruits",
    "description": "Fresh organic apples from local farms",
    "inStock": true,
    "quantity": 0,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

### Orders

#### Create Order

Create a new order (requires authentication).

**Request**
```
POST /orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "storeId": "507f1f77bcf86cd799439011",
  "items": [
    {
      "productId": "507f1f77bcf86cd799439013",
      "name": "Organic Apples",
      "quantity": 2,
      "price": 4.99,
      "total": 9.98
    }
  ],
  "totalAmount": 9.98,
  "paymentMethod": "offline"
}
```

**Response**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "orderNumber": "ORD-1705316400000-abc123def",
    "buyerId": "507f1f77bcf86cd799439011",
    "storeId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439013",
        "name": "Organic Apples",
        "quantity": 2,
        "price": 4.99,
        "total": 9.98
      }
    ],
    "totalAmount": 9.98,
    "paymentMethod": "offline",
    "status": "pending",
    "deliveryEnabled": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get Order Details

Retrieve detailed information about a specific order (requires authentication).

**Request**
```
GET /orders/:orderId
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "data": {
    "_id": "507f1f77bcf86cd799439014",
    "orderNumber": "ORD-1705316400000-abc123def",
    "buyerId": "507f1f77bcf86cd799439011",
    "storeId": "507f1f77bcf86cd799439011",
    "items": [
      {
        "productId": "507f1f77bcf86cd799439013",
        "name": "Organic Apples",
        "quantity": 2,
        "price": 4.99,
        "total": 9.98
      }
    ],
    "totalAmount": 9.98,
    "paymentMethod": "offline",
    "status": "pending",
    "deliveryEnabled": false,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
}
```

#### Get My Orders

Retrieve all orders for the authenticated user (requires authentication).

**Request**
```
GET /orders
Authorization: Bearer <token>
```

**Response**
```json
{
  "success": true,
  "data": [
    {
      "_id": "507f1f77bcf86cd799439014",
      "orderNumber": "ORD-1705316400000-abc123def",
      "buyerId": "507f1f77bcf86cd799439011",
      "storeId": "507f1f77bcf86cd799439011",
      "items": [...],
      "totalAmount": 9.98,
      "paymentMethod": "offline",
      "status": "pending",
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  ]
}
```

## Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "message": "Missing required fields"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "message": "No token provided"
}
```

### 404 Not Found

```json
{
  "success": false,
  "message": "Store not found"
}
```

### 500 Internal Server Error

```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Rate Limiting

API endpoints are rate-limited to prevent abuse. Current limits:
- **Default**: 100 requests per 15 minutes per IP address
- **Auth endpoints**: 5 requests per 15 minutes per IP address

---

For more information, see the [Developer Guide](./DEVELOPER_GUIDE.md).
