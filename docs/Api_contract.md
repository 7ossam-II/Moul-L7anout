Moul L7anout API Contract v1.0




**Base URL**  
Development: `http://localhost:5000/api`  
Production: `https://api.moull7anout.com/api`

**Authentication**  
Protected endpoints require a Bearer token:  
`Authorization: Bearer <jwt_token>`

**Error Response Format** (all errors)

```json
{
  "success": false,
  "error": "Error message",
  "details": []
}
```
**Common Status Codes**


| Month | Savings |
|:-------:| :-------|
| 200 | OK |
| 201 | created |
| 400 | Bad request|
| 401 | Unauthorized|
| 403 | Forbidden|
| 404 | Not found|
| 500 | server error|



1\. Authentication
------------------

### POST /auth/register

Register a new user (OTP will be sent separately; this just creates the user).

**Request**

```json

{
  "phone": "0612345678",
  "fullName": "Ahmed Benjelloun",
  "role": "BUYER"
}
 ```
**Response (200)**

```json
 {    "success": true,   
  "user": {      "id": 1, 
    "phone": "0612345678", 
    "fullName": "Hmida bazaglo",   
    "role": "BUYER",
    "verified": false    }  } 
```

### POST /auth/login

Request OTP.

**Request**

```json
{    "phone": "0612345678"  }   
```
**Response (200)**

```json
 {    "success": true, 
  "message": "OTP sent"  }   
```
### POST /auth/verify-otp

Verify OTP and receive JWT token.

**Request**

```json

{    "phone": "0612345678", 
        "otp": "123456"  }   
```
**Response (200)**

```json

 {    "success": true,   
      "token": "eyJhbGciOiJIUzI1NiIs...",  
      "user": { 
        "id": 1,   
        "phone": "0612345678",
        "fullName": "Ahmed Benjelloun",
        "role": "BUYER"    
 }
 }
````

2\. Stores (Location‑based)
---------------------------

### GET /stores

Get nearby stores sorted by distance, with filters.

**Query parameters**


|Name|Type|Required|Description|
|------|------|-----|----------|
|lat|float|yes|User latitude|
|lng|float|yes|User longitude|
|radius|int|no|Meters: 100,200,300,400 (default 500)|
|type|string|no|e.g., TACOS, LKHODRA, LHRI|
|openOnly|boolean|no|true/false (default false)|
|deliveryAvailable|boolean|no|true/false|
|lkridiEnabled|boolean|no|true/false|





**Response (200)**

```json
 {    "success": true,
      "stores": [ 
        {
          "id": 1,
          "name": "Tacos Blkfotlan",
          "storeType": "TACOS",
          "openStatus": true,
          "deliveryFlatFee": 10.00,
          "ratingAvg": 4.5,
          "distance": 250,
          "location": { "lat": 33.5731, 
                        "lng": -7.5898
          }
        }
              ]
}   
```
### GET /stores/:storeId

Get store details.

**Response (200)**

```json
   {    "success": true,
        "store": {
          "id": 1,
          "name": "Tacos Blkfotlan",
          "storeType": "TACOS",
          "openStatus": true,
          "address": "123 Main St",
          "location": {
                "lat": 33.5731,
                "lng": -7.5898
          },
          "deliveryFlatFee": 10.00,
          "ratingAvg": 4.5,
          "lkridiEnabled": true
        }
}   
```
### GET /stores/:storeId/products

Get all products of a store.

**Response (200)**

```json

  { 
    "success": true,
    "products": [
      {
        "id": 1,
        "name": "Tacos Blkfotlan",
        "price": 35.00,
        "photoUrl": "https://...",
        "deliveryAvailable": true,
        "maxPerDelivery": 5,
        "availableStatus": true,
        "expectedAvailabilityDate": null
      }
    ]
  }   
```
3\. Orders & Checkout
---------------------

### POST /orders

Create one or more orders (one per store if cart has multiple stores).

**Request**

```json

  {    "buyerId": 1,
    "items": [
      { "storeId": 1, "productId": 1, "quantity": 2 },
      { "storeId": 1, "productId": 3, "quantity": 1 }    
    ], 
    "paymentMethod": "ONLINE",
    "deliveryAddress": "anassi 3asima",
    "deliverySlot": "2026-04-24T14:00:00Z"  }   
```
**Response (200)**

```json

  {    "success": true,  
       "orders": [
      {
        "orderId": 100,
        "storeId": 1,
        "totalAmount": 105.00,
        "paymentMethod": "ONLINE",
        "orderStatus": "QR_GENERATED",
        "qrCode": "encrypted_token_here",
        "expiresAt": "2026-04-25T10:00:00Z"
      }
       ]
  }   
```
### GET /orders/:orderId

Get order details.

**Response (200)**

```json

  {    "success": true,
        "order": {
          "id": 100,
          "buyerId": 1,
          "storeId": 1,
          "totalAmount": 105.00,
          "paymentMethod": "ONLINE",
          "orderStatus": "QR_GENERATED",
          "createdAt": "2026-04-23T10:00:00Z",
          "items": [
            { "productId": 1, "name": "Tacos", "quantity": 2, "unitPrice": 35.00 }     
          ]
        }
  }   
```
### POST /orders/:orderId/accomplished

Mark order as accomplished (both buyer and seller press this).

**Request**

```json

 {    "userId": 1,
      "role": "BUYER"  }   
```
**Response (200)**

```json

   {    "success": true,
        "message": "Order accomplished. Money released from escrow (if online)."  }   
```
4\. LKRIDI 
------------------------

### POST /lkridi/membership/request

Buyer requests LKRIDI membership from a seller.

**Request**

```json

  {    
    "buyerId": 1,    
    "sellerId": 5
  }   
```
**Response (200)**

```json
 {    "success": true,
      "membershipId": 10,
      "approvalStatus": "PENDING"  }   
```
### POST /lkridi/membership/:membershipId/approve

Seller approves or denies membership.

**Request**

```json

{    
  "sellerId": 5,
  "approved": true  
}   
```
**Response (200)**

```json
 {    
  "success": true,
  "approvalStatus": "APPROVED"
}   
```
### POST /lkridi/orders

Create a LKRIDI order (buyer requests loan). Seller will later accept/reject.

**Request**

```json

  {
    "buyerId": 1,
    "storeId": 2,
    "items": [
      {
        "productId": 5, "quantity": 3
      }],
    "deadline": "2026-05-14T00:00:00Z"
  }   
```
**Response (200)**

```json
 {"success": true,
  "orderId": 200,
  "amountOwed": 150.00,
  "orderStatus": "PENDING",
  "qrCode": "encrypted_token"
}   
```
### POST /lkridi/orders/:orderId/accept

Seller accepts a LKRIDI order.

**Response (200)**

```json
   {    
    "success": true,
    "orderStatus": "QR_GENERATED"
  }   
```
### POST /lkridi/orders/:orderId/repay

Buyer marks loan as paid (requires seller confirmation).

**Request**

```json
   {    
  "buyerId": 1,
  "sellerId": 5
}   
```
**Response (200)**

```json

 {    
   "success": true,
   "message": "Loan marked as paid. Waiting for seller confirmation."  }   
```


### POST /lkridi/records/:recordId/confirm-payment

Seller confirms that loan is paid.

**Response (200)**

```json

{    
  "success": true,
  "repaymentStatus": "PAID"  }   
```

5\. Delivery
------------

### GET /delivery/orders/:orderId/qr

Seller retrieves QR code for delivery person (after order is ready for delivery).

**Response (200)**

```json

   {    "success": true,
        "qrCode": "encrypted_delivery_token",
        "expiresAt": 
   "2026-04-25T14:00:00Z"  }   
```
### POST /delivery/complete

Delivery person scans QR at buyer's door, buyer scans same QR.

**Request**

```json

  {
      "orderId": 300,
      "qrToken": "encrypted_delivery_token",
      "scannedBy": "DELIVERY_PERSON"  }   
```
**Response (200)**

```json

 {    "success": true,
   "message": "Delivery confirmed. Order completed."  }   
```
6\. Admin
---------

### GET /admin/pending-sellers

List sellers awaiting approval (Admin only).

**Response (200)**

```json

   {    "success": true,
     "pendingSellers": [
       {
         "userId": 10,
         "storeName": "Fresh Spices",
         "idDocumentUrl": "https://...",
         "submittedAt": "2026-04-10T10:00:00Z"
       }    
     ]
   }   
```
### POST /admin/sellers/:userId/approve

Approve or reject seller registration.

**Request**

```json

  {
    "adminId": 1,
    "approved": true  }   
```
**Response (200)**

```json

   { 
     "success": true,
     "message": "Seller approved"  }   
```
### GET /admin/disputes

List disputes and refund requests (Admin only).

**Response (200)** – array of disputes.

### POST /admin/videos/:videoId/approve

Approve seller video ad.

7\. Chat
--------

### GET /chat/messages

Get messages between two users, optionally filtered by order.

**Query parameters**

| Name        |Type|Required| Description          |
|-------------|------|-----|----------------------|
| userId      |int|yes| Current user ID      |
| otherUserId |int|yes| Other participant ID |
|    orderId  |int|no|    Filter by order                  |



**Response (200)**

```json

 {    
   "success": true,
   "messages":
   [ 
     { 
       "id": 1,
       "senderId": 1,
       "receiverId": 2,
       "content": "Hello",
       "timestamp": "2026-04-23T10:00:00Z"
     }    
   ]
 }   
```
### POST /chat/messages

Send a message.

**Request**

```json

 {    "senderId": 1,
   "receiverId": 2,
   "orderId": null,
   "content": "Is the product fresh?"
 }   
```
**Response (200)**

```json

  {    
    "success": true,
    "message": { 
      "id": 1,
      "senderId": 1,
      "receiverId": 2,
      "content": "Is the product fresh?",
      "timestamp": "2026-04-23T10:00:00Z"
    }
  }   
```
8\. Rating
----------

### POST /ratings

Leave a rating for a store after order completion.

**Request**

```json

  {    
    "buyerId": 1,
    "storeId": 2,
    "orderId": 100,
    "score": 5,
    "comment": "Great food!"
  }   
```
**Response (200)**

```json
  {    
  "success": true,
  "ratingId": 10  }   
```
### GET /stores/:storeId/ratings

Get all ratings for a store.

**Response (200)** – array of ratings.

Appendix: Enum Values
---------------------

|Field|Possible values|
|--|--|
|role|BUYER, SELLER, ADMIN, DELIVERY\_PERSON, CASHIER|
|paymentMethod|ONLINE, OFFLINE, LKRIDI|
|orderStatus|PENDING, QR\_GENERATED, ACCOMPLISHED, REFUNDED|
|storeType|TACOS, LKHODRA, LHRI, ... (dynamic, admin can add)|
|approvalStatus|PENDING, APPROVED, DENIED|
|repaymentStatus|UNPAID, PAID|



**Version:** 1.0

**Last updated:** 2026-04-23

**Maintainer:** Yahya (Backend Lead)