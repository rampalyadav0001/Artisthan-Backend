# Artisthan Backend

## Project Overview

Artisthan is a backend application designed to support an art and craft marketplace platform, connecting artisans with potential buyers and providing a comprehensive ecosystem for traditional crafts.

## Features

- User Authentication and Authorization
- Artisan Profile Management
- Product Listing and Management
- Order Processing
- Cart Functionality
- Search and Filtering
- Location-based Services

## Technology Stack

- **Language**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Token (JWT)
- **Cloud Services**: Cloudinary (for image uploads)

## Prerequisites

- Node.js (v14 or later)
- MongoDB
- Cloudinary Account

## Installation

1. Clone the repository
```bash
git clone https://github.com/rampalyadav0001/Artisthan-Backend.git
cd Artisthan-Backend
```

2. Install dependencies
```bash
npm install
```

3. Create a `.env` file with the following variables:
```
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

4. Run the application
```bash
npm start
```

## API Routes

### Authentication Routes
- `POST /api/auth/register`: User registration
- `POST /api/auth/login`: User login
- `POST /api/auth/logout`: User logout

### User Routes
- `GET /api/users/profile`: Get user profile
- `PUT /api/users/profile`: Update user profile
- `POST /api/users/artisan-registration`: Register as an artisan

### Product Routes
- `GET /api/products`: List all products
- `GET /api/products/:id`: Get product details
- `POST /api/products`: Create a new product (Artisan only)
- `PUT /api/products/:id`: Update product (Artisan only)
- `DELETE /api/products/:id`: Delete product (Artisan only)

### Cart Routes
- `GET /api/cart`: View cart
- `POST /api/cart/add`: Add item to cart
- `PUT /api/cart/update`: Update cart item quantity
- `DELETE /api/cart/remove/:productId`: Remove item from cart

### Order Routes
- `GET /api/orders`: List user orders
- `POST /api/orders`: Create a new order
- `GET /api/orders/:id`: Get order details

### Search and Filter Routes
- `GET /api/search`: Search products
- `GET /api/products/category/:categoryName`: Filter by category
- `GET /api/products/location`: Search by artisan location

### Artisan Routes
- `GET /api/artisans`: List artisans
- `GET /api/artisans/:id`: Get artisan profile
- `POST /api/artisans/verify`: Verify artisan documents

## Authentication Flow

1. User registers using `/api/auth/register`
2. User logs in using `/api/auth/login`
3. Receives JWT token for authenticated routes
4. Include token in `Authorization` header for protected routes

## Error Handling

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

Distributed under the MIT License. See `LICENSE` for more information.

## Contact

Rampal Yadav - [Your Email or LinkedIn]

Project Link: [https://github.com/rampalyadav0001/Artisthan-Backend](https://github.com/rampalyadav0001/Artisthan-Backend)
