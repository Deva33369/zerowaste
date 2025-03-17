# ZeroWaste API Documentation

This document outlines the API endpoints available for the ZeroWaste application.

## Base URL

The base URL for all API requests is:
```
http://localhost:5000/api
```

## Authentication

Most endpoints require authentication using a JWT token. Include the token in the Authorization header:
```
Authorization: Bearer YOUR_TOKEN
```

## User Endpoints

### Register User
- **URL**: `/users/register`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123",
    "userType": "donor",
    "phone": "555-123-4567",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345"
    }
  }
  ```
- **Success Response**: Status 201
  ```json
  {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "donor",
    "token": "jwt_token"
  }
  ```

### Login User
- **URL**: `/users/login`
- **Method**: `POST`
- **Auth Required**: No
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "password123"
  }
  ```
- **Success Response**: Status 200
  ```json
  {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "donor",
    "token": "jwt_token"
  }
  ```

### Get User Profile
- **URL**: `/users/me`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: Status 200
  ```json
  {
    "_id": "userId",
    "name": "John Doe",
    "email": "john@example.com",
    "userType": "donor",
    "phone": "555-123-4567",
    "address": {
      "street": "123 Main St",
      "city": "Anytown",
      "state": "CA",
      "zipCode": "12345"
    },
    "createdAt": "2023-05-15T10:30:00.000Z"
  }
  ```

### Update User Profile
- **URL**: `/users/me`
- **Method**: `PUT`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "name": "John Updated",
    "email": "john_updated@example.com",
    "phone": "555-987-6543",
    "address": {
      "street": "456 New St",
      "city": "Newtown",
      "state": "CA",
      "zipCode": "54321"
    }
  }
  ```
- **Success Response**: Status 200
  ```json
  {
    "_id": "userId",
    "name": "John Updated",
    "email": "john_updated@example.com",
    "userType": "donor",
    "phone": "555-987-6543",
    "address": {
      "street": "456 New St",
      "city": "Newtown",
      "state": "CA",
      "zipCode": "54321"
    }
  }
  ```

## Waste Item Endpoints

### Get All Waste Items
- **URL**: `/waste-items`
- **Method**: `GET`
- **Auth Required**: No
- **Query Parameters**:
  - `page`: Page number (default: 1)
  - `limit`: Items per page (default: 10)
  - `category`: Filter by category ID
  - `condition`: Filter by condition
  - `keyword`: Search in title and description
- **Success Response**: Status 200
  ```json
  {
    "wasteItems": [
      {
        "_id": "wasteItemId",
        "title": "Office Chair",
        "description": "Ergonomic office chair in good condition",
        "category": "categoryId",
        "condition": "good",
        "quantity": 1,
        "images": ["image_url.jpg"],
        "user": {
          "_id": "userId",
          "name": "John Doe",
          "email": "john@example.com"
        },
        "isAvailable": true,
        "createdAt": "2023-05-15T10:30:00.000Z"
      }
    ],
    "page": 1,
    "pages": 5,
    "total": 50
  }
  ```

### Get Waste Item by ID
- **URL**: `/waste-items/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: Status 200
  ```json
  {
    "_id": "wasteItemId",
    "title": "Office Chair",
    "description": "Ergonomic office chair in good condition",
    "category": "categoryId",
    "condition": "good",
    "quantity": 1,
    "images": ["image_url.jpg"],
    "pickupDetails": {
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345"
      },
      "instructions": "Call before coming",
      "availableTimes": ["Weekdays after 5pm", "Weekends"]
    },
    "user": {
      "_id": "userId",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-123-4567",
      "userType": "donor"
    },
    "isAvailable": true,
    "createdAt": "2023-05-15T10:30:00.000Z"
  }
  ```

### Create Waste Item
- **URL**: `/waste-items`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "title": "Office Chair",
    "description": "Ergonomic office chair in good condition",
    "category": "categoryId",
    "condition": "good",
    "quantity": 1,
    "images": ["image_url.jpg"],
    "pickupDetails": {
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345"
      },
      "instructions": "Call before coming",
      "availableTimes": ["Weekdays after 5pm", "Weekends"]
    }
  }
  ```
- **Success Response**: Status 201
  ```json
  {
    "_id": "wasteItemId",
    "title": "Office Chair",
    "description": "Ergonomic office chair in good condition",
    "category": "categoryId",
    "condition": "good",
    "quantity": 1,
    "images": ["image_url.jpg"],
    "pickupDetails": {
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345"
      },
      "instructions": "Call before coming",
      "availableTimes": ["Weekdays after 5pm", "Weekends"]
    },
    "user": "userId",
    "isAvailable": true,
    "createdAt": "2023-05-15T10:30:00.000Z"
  }
  ```

### Update Waste Item
- **URL**: `/waste-items/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (owner only)
- **Body**:
  ```json
  {
    "title": "Ergonomic Office Chair",
    "description": "Updated description",
    "condition": "likeNew",
    "isAvailable": true
  }
  ```
- **Success Response**: Status 200
  ```json
  {
    "_id": "wasteItemId",
    "title": "Ergonomic Office Chair",
    "description": "Updated description",
    "category": "categoryId",
    "condition": "likeNew",
    "quantity": 1,
    "images": ["image_url.jpg"],
    "pickupDetails": {
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345"
      },
      "instructions": "Call before coming",
      "availableTimes": ["Weekdays after 5pm", "Weekends"]
    },
    "user": "userId",
    "isAvailable": true,
    "createdAt": "2023-05-15T10:30:00.000Z",
    "updatedAt": "2023-05-16T08:15:00.000Z"
  }
  ```

### Delete Waste Item
- **URL**: `/waste-items/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (owner only)
- **Success Response**: Status 200
  ```json
  {
    "message": "Waste item removed"
  }
  ```

### Get User's Waste Items
- **URL**: `/waste-items/user/items`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: Status 200
  ```json
  [
    {
      "_id": "wasteItemId",
      "title": "Office Chair",
      "description": "Ergonomic office chair in good condition",
      "category": "categoryId",
      "condition": "good",
      "quantity": 1,
      "images": ["image_url.jpg"],
      "isAvailable": true,
      "createdAt": "2023-05-15T10:30:00.000Z"
    }
  ]
  ```

### Get Nearby Waste Items
- **URL**: `/waste-items/nearby/items`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `distance`: Maximum distance in kilometers (default: 10)
- **Success Response**: Status 200
  ```json
  [
    {
      "_id": "wasteItemId",
      "title": "Office Chair",
      "description": "Ergonomic office chair in good condition",
      "category": "categoryId",
      "condition": "good",
      "quantity": 1,
      "images": ["image_url.jpg"],
      "user": {
        "_id": "userId",
        "name": "John Doe",
        "email": "john@example.com"
      },
      "isAvailable": true,
      "createdAt": "2023-05-15T10:30:00.000Z"
    }
  ]
  ```

## Request Endpoints

### Create Request
- **URL**: `/requests`
- **Method**: `POST`
- **Auth Required**: Yes
- **Body**:
  ```json
  {
    "wasteItemId": "wasteItemId",
    "message": "I'm interested in your office chair.",
    "pickupDate": "2023-05-20T15:00:00.000Z"
  }
  ```
- **Success Response**: Status 201
  ```json
  {
    "_id": "requestId",
    "requester": {
      "_id": "userId",
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "provider": {
      "_id": "providerId",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "wasteItem": {
      "_id": "wasteItemId",
      "title": "Office Chair",
      "images": ["image_url.jpg"]
    },
    "message": "I'm interested in your office chair.",
    "status": "pending",
    "pickupDate": "2023-05-20T15:00:00.000Z",
    "createdAt": "2023-05-17T10:30:00.000Z"
  }
  ```

### Get User Requests
- **URL**: `/requests`
- **Method**: `GET`
- **Auth Required**: Yes
- **Query Parameters**:
  - `status`: Filter by status
  - `role`: 'requester', 'provider', or 'all' (default)
- **Success Response**: Status 200
  ```json
  [
    {
      "_id": "requestId",
      "requester": {
        "_id": "userId",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "phone": "555-987-6543"
      },
      "provider": {
        "_id": "providerId",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "555-123-4567"
      },
      "wasteItem": {
        "_id": "wasteItemId",
        "title": "Office Chair",
        "description": "Ergonomic office chair in good condition",
        "images": ["image_url.jpg"],
        "category": "categoryId",
        "condition": "good"
      },
      "message": "I'm interested in your office chair.",
      "status": "pending",
      "pickupDate": "2023-05-20T15:00:00.000Z",
      "createdAt": "2023-05-17T10:30:00.000Z"
    }
  ]
  ```

### Get Request by ID
- **URL**: `/requests/:id`
- **Method**: `GET`
- **Auth Required**: Yes (requester or provider only)
- **Success Response**: Status 200
  ```json
  {
    "_id": "requestId",
    "requester": {
      "_id": "userId",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "555-987-6543",
      "address": {
        "street": "789 Other St",
        "city": "Othertown",
        "state": "CA",
        "zipCode": "67890"
      }
    },
    "provider": {
      "_id": "providerId",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-123-4567",
      "address": {
        "street": "123 Main St",
        "city": "Anytown",
        "state": "CA",
        "zipCode": "12345"
      }
    },
    "wasteItem": {
      "_id": "wasteItemId",
      "title": "Office Chair",
      "description": "Ergonomic office chair in good condition",
      "category": "categoryId",
      "condition": "good",
      "quantity": 1,
      "images": ["image_url.jpg"],
      "isAvailable": true
    },
    "message": "I'm interested in your office chair.",
    "status": "pending",
    "pickupDate": "2023-05-20T15:00:00.000Z",
    "createdAt": "2023-05-17T10:30:00.000Z"
  }
  ```

### Update Request Status
- **URL**: `/requests/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (provider only)
- **Body**:
  ```json
  {
    "status": "accepted",
    "message": "You can pick it up on the scheduled date.",
    "pickupDate": "2023-05-20T15:00:00.000Z"
  }
  ```
- **Success Response**: Status 200
  ```json
  {
    "_id": "requestId",
    "requester": {
      "_id": "userId",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "phone": "555-987-6543"
    },
    "provider": {
      "_id": "providerId",
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-123-4567"
    },
    "wasteItem": {
      "_id": "wasteItemId",
      "title": "Office Chair",
      "images": ["image_url.jpg"]
    },
    "message": "I'm interested in your office chair.",
    "responseMessage": "You can pick it up on the scheduled date.",
    "status": "accepted",
    "pickupDate": "2023-05-20T15:00:00.000Z",
    "createdAt": "2023-05-17T10:30:00.000Z",
    "updatedAt": "2023-05-17T11:45:00.000Z"
  }
  ```

### Cancel Request
- **URL**: `/requests/:id/cancel`
- **Method**: `PUT`
- **Auth Required**: Yes (requester only)
- **Body**:
  ```json
  {
    "reason": "I found another office chair closer to me."
  }
  ```
- **Success Response**: Status 200
  ```json
  {
    "_id": "requestId",
    "requester": "userId",
    "provider": "providerId",
    "wasteItem": "wasteItemId",
    "message": "I'm interested in your office chair.",
    "status": "cancelled",
    "pickupDate": "2023-05-20T15:00:00.000Z",
    "cancellationReason": "I found another office chair closer to me.",
    "cancelledAt": "2023-05-18T09:30:00.000Z",
    "createdAt": "2023-05-17T10:30:00.000Z",
    "updatedAt": "2023-05-18T09:30:00.000Z"
  }
  ```

### Get Request Statistics
- **URL**: `/requests/stats`
- **Method**: `GET`
- **Auth Required**: Yes
- **Success Response**: Status 200
  ```json
  {
    "pending": 5,
    "accepted": 3,
    "rejected": 2,
    "completed": 10,
    "cancelled": 1,
    "total": 21
  }
  ```

## Category Endpoints

### Get All Categories
- **URL**: `/categories`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: Status 200
  ```json
  [
    {
      "_id": "categoryId",
      "name": "Furniture",
      "description": "Household furniture like tables, chairs, sofas, etc.",
      "icon": "chair",
      "createdAt": "2023-05-15T10:30:00.000Z"
    }
  ]
  ```

### Get Category by ID
- **URL**: `/categories/:id`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: Status 200
  ```json
  {
    "_id": "categoryId",
    "name": "Furniture",
    "description": "Household furniture like tables, chairs, sofas, etc.",
    "icon": "chair",
    "createdAt": "2023-05-15T10:30:00.000Z"
  }
  ```

### Create Category (Admin Only)
- **URL**: `/categories`
- **Method**: `POST`
- **Auth Required**: Yes (admin only)
- **Body**:
  ```json
  {
    "name": "Furniture",
    "description": "Household furniture like tables, chairs, sofas, etc.",
    "icon": "chair"
  }
  ```
- **Success Response**: Status 201
  ```json
  {
    "_id": "categoryId",
    "name": "Furniture",
    "description": "Household furniture like tables, chairs, sofas, etc.",
    "icon": "chair",
    "createdAt": "2023-05-15T10:30:00.000Z"
  }
  ```

### Update Category (Admin Only)
- **URL**: `/categories/:id`
- **Method**: `PUT`
- **Auth Required**: Yes (admin only)
- **Body**:
  ```json
  {
    "name": "Home Furniture",
    "description": "Updated description",
    "icon": "weekend"
  }
  ```
- **Success Response**: Status 200
  ```json
  {
    "_id": "categoryId",
    "name": "Home Furniture",
    "description": "Updated description",
    "icon": "weekend",
    "createdAt": "2023-05-15T10:30:00.000Z"
  }
  ```

### Delete Category (Admin Only)
- **URL**: `/categories/:id`
- **Method**: `DELETE`
- **Auth Required**: Yes (admin only)
- **Success Response**: Status 200
  ```json
  {
    "message": "Category removed"
  }
  ```

### Get Category Statistics
- **URL**: `/categories/stats`
- **Method**: `GET`
- **Auth Required**: No
- **Success Response**: Status 200
  ```json
  [
    {
      "_id": "categoryId",
      "name": "Furniture",
      "count": 15
    }
  ]
  ```

## Upload Endpoints

### Upload Single Image
- **URL**: `/upload`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request**: Form-data with 'image' field
- **Success Response**: Status 200
  ```json
  {
    "message": "Image uploaded successfully",
    "image": "/uploads/image-1621077000000.jpg",
    "filename": "image-1621077000000.jpg"
  }
  ```

### Upload Multiple Images
- **URL**: `/upload/multiple`
- **Method**: `POST`
- **Auth Required**: Yes
- **Request**: Form-data with 'images' field (up to 5 files)
- **Success Response**: Status 200
  ```json
  {
    "message": "Images uploaded successfully",
    "images": [
      {
        "path": "/uploads/images-1621077000000.jpg",
        "filename": "images-1621077000000.jpg"
      }
    ],
    "count": 1
  }
  ```

### Delete Image
- **URL**: `/upload/:filename`
- **Method**: `DELETE`
- **Auth Required**: Yes
- **Success Response**: Status 200
  ```json
  {
    "message": "File deleted successfully"
  }
  ```

## Error Responses

All endpoints may return the following error responses:

### Bad Request
- **Status Code**: 400
- **Response**:
  ```json
  {
    "message": "Error message describing the issue"
  }
  ```

### Unauthorized
- **Status Code**: 401
- **Response**:
  ```json
  {
    "message": "Not authorized, no token"
  }
  ```

### Forbidden
- **Status Code**: 403
- **Response**:
  ```json
  {
    "message": "Not authorized to perform this action"
  }
  ```

### Not Found
- **Status Code**: 404
- **Response**:
  ```json
  {
    "message": "Resource not found"
  }
  ```

### Server Error
- **Status Code**: 500
- **Response**:
  ```json
  {
    "message": "Server error message",
    "stack": "Stack trace (development only)"
  }
  ``` 