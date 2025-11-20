# E-Commerce Application

A full-stack e-commerce application built with Next.js, TypeScript, Prisma, and SQLite featuring role-based access control and complete CRUD operations.

## Features

### Authentication & Authorization
- User registration and login system
- JWT-based authentication
- Three role levels: **Admin**, **Manager**, and **User**

### Role-Based Permissions

#### Admin
- Create and delete accounts of all types (Admin, Manager, User)
- Full product management (Create, Read, Update, Delete)
- Full user management
- Complete system access

#### Manager
- Create and edit USER accounts only
- Full product management (Create, Read, Update, Delete)
- View all users
- Cannot manage Admin or Manager accounts

#### User
- Update own email and password only
- Browse products
- View product details
- No administrative access

### Product Management
- 40 pre-seeded products
- 15 products with 15% discount
- Product categories
- Stock management
- Image support

### User Interface
- Modern, responsive design with Tailwind CSS
- Login and Registration pages
- Main e-commerce store page
- Admin/Manager Dashboard
- User Profile page
- Product filtering by category
- Special offers section

## Tech Stack

- **Frontend**: Next.js 14, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: SQLite with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **Password Hashing**: bcryptjs

## Getting Started

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up the database:**
```bash
npm run prisma:generate
npm run prisma:push
```

3. **Seed the database with demo data:**
```bash
npm run prisma:seed
```

4. **Start the development server:**
```bash
npm run dev
```

5. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Credentials

Use these credentials to test different role levels:

- **Admin Account**
  - Email: `admin@example.com`
  - Password: `password123`

- **Manager Account**
  - Email: `manager@example.com`
  - Password: `password123`

- **User Account**
  - Email: `user@example.com`
  - Password: `password123`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products (CRUD)
- `GET /api/products` - Get all products (public)
- `POST /api/products` - Create product (Admin/Manager)
- `GET /api/products/[id]` - Get single product (public)
- `PUT /api/products/[id]` - Update product (Admin/Manager)
- `DELETE /api/products/[id]` - Delete product (Admin/Manager)

### Users (CRUD)
- `GET /api/users` - Get all users (Admin/Manager)
- `POST /api/users` - Create user (Admin/Manager)
- `GET /api/users/[id]` - Get single user
- `PUT /api/users/[id]` - Update user (role-based)
- `DELETE /api/users/[id]` - Delete user (Admin only)

## Project Structure

```
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── products/      # Product CRUD endpoints
│   │   └── users/         # User CRUD endpoints
│   ├── dashboard/         # Admin/Manager dashboard
│   ├── login/            # Login page
│   ├── profile/          # User profile page
│   ├── register/         # Registration page
│   ├── layout.tsx        # Root layout
│   ├── page.tsx          # Main store page
│   └── globals.css       # Global styles
├── lib/
│   ├── auth.ts           # JWT utilities
│   └── prisma.ts         # Prisma client
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Database seeding script
└── README.md
```

## Database Schema

### User Model
- `id` - Unique identifier
- `email` - Unique email address
- `password` - Hashed password
- `name` - User's full name
- `role` - Enum: ADMIN, MANAGER, USER
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

### Product Model
- `id` - Unique identifier
- `name` - Product name
- `description` - Product description
- `price` - Product price
- `discount` - Discount percentage (0-100)
- `image` - Product image URL
- `category` - Product category
- `stock` - Available stock quantity
- `createdAt` - Timestamp
- `updatedAt` - Timestamp

## Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run prisma:generate  # Generate Prisma Client
npm run prisma:push      # Push schema to database
npm run prisma:seed      # Seed database
npm run prisma:studio    # Open Prisma Studio
```

### Prisma Studio

To visually manage your database:
```bash
npm run prisma:studio
```

## Security Features

- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control (RBAC)
- Protected API routes
- Input validation

## Future Enhancements

- Shopping cart functionality
- Order management
- Payment integration
- Product reviews and ratings
- Image upload functionality
- Email notifications
- Search functionality
- Pagination for products/users
- Advanced filtering and sorting

## License

MIT License - feel free to use this project for learning or commercial purposes.

