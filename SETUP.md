# Quick Setup Guide

## Step-by-Step Installation

### 1. Install Dependencies
```bash
npm install
```

This will install all required packages including:
- Next.js and React
- Prisma (ORM)
- TypeScript
- Tailwind CSS
- Authentication libraries (bcryptjs, jsonwebtoken)

### 2. Initialize Database
```bash
npm run prisma:generate
npm run prisma:push
```

This creates the SQLite database and generates the Prisma Client.

### 3. Seed Database with Demo Data
```bash
npm run prisma:seed
```

This creates:
- 3 demo users (Admin, Manager, User)
- 40 products (15 with 15% discount)

### 4. Start Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## Demo Login Credentials

### Administrator Account
- **Email:** admin@example.com
- **Password:** password123
- **Capabilities:** Full system access

### Manager Account
- **Email:** manager@example.com
- **Password:** password123
- **Capabilities:** Manage products and USER accounts

### Regular User Account
- **Email:** user@example.com
- **Password:** password123
- **Capabilities:** Edit own profile only

## Testing the Application

1. **Visit the Store:** Go to http://localhost:3000
2. **Browse Products:** View 40 products, 15 with special discounts
3. **Login:** Use any of the demo accounts above
4. **Test Admin Features:**
   - Login as admin@example.com
   - Access Dashboard
   - Create/Edit/Delete products and users
5. **Test Manager Features:**
   - Login as manager@example.com
   - Access Dashboard
   - Manage products and USER accounts
6. **Test User Features:**
   - Login as user@example.com
   - Update profile (email/password only)

## Troubleshooting

### Port Already in Use
If port 3000 is busy, you can start on a different port:
```bash
npm run dev -- -p 3001
```

### Database Issues
Reset the database:
```bash
rm prisma/dev.db
npm run prisma:push
npm run prisma:seed
```

### Node Modules Issues
Clean install:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Project Features Checklist

✅ **Authentication System**
- Login page with JWT authentication
- Registration page for new users
- Role-based access control (Admin, Manager, User)

✅ **E-Commerce Store**
- 40 products displayed
- 15 products with 15% discount
- Category filtering
- Responsive product grid

✅ **Admin Dashboard**
- Create/Edit/Delete all user accounts
- Create/Edit/Delete products
- Full CRUD operations

✅ **Manager Dashboard**
- Create/Edit USER accounts
- Manage products (full CRUD)
- View all users

✅ **User Profile**
- Update own email
- Change password
- View account information

✅ **Prisma Backend**
- SQLite database
- User model with roles
- Product model
- Complete CRUD operations
- Seeded demo data

## Next Steps

- Customize the products in `prisma/seed.ts`
- Update the JWT secret in `.env` for production
- Add shopping cart functionality
- Implement order management
- Add payment processing
- Deploy to production (Vercel recommended)

## Support

For issues or questions, refer to the main README.md file.

