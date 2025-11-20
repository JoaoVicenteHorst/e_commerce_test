/**
 * Production Database Seeding Script
 * Run this locally after deploying to Vercel to seed the production database
 * 
 * Usage:
 * 1. Make sure DATABASE_URL in .env.local points to your Render PostgreSQL
 * 2. Run: npx tsx scripts/seed-production.ts
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting production database seeding...\n');

  // Check if already seeded
  const existingAdmin = await prisma.user.findUnique({
    where: { email: 'admin@example.com' },
  });

  if (existingAdmin) {
    console.log('⚠️  Database already seeded! Admin user already exists.');
    console.log('   If you want to reseed, delete existing data first.\n');
    return;
  }

  // Create users
  console.log('👥 Creating users...');
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.create({
    data: {
      email: 'manager@example.com',
      password: hashedPassword,
      name: 'Manager User',
      role: 'MANAGER',
    },
  });

  const user = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      name: 'Regular User',
      role: 'USER',
    },
  });

  console.log('✅ Created 3 users (Admin, Manager, User)\n');

  // Create 40 products (15 with 15% discount)
  console.log('📦 Creating products...');
  const categories = ['Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books', 'Toys'];
  const productNames = [
    'Wireless Headphones', 'Smart Watch', 'Laptop Stand', 'USB-C Cable', 'Phone Case',
    'Bluetooth Speaker', 'Mechanical Keyboard', 'Gaming Mouse', 'Monitor', 'Webcam',
    'Cotton T-Shirt', 'Denim Jeans', 'Running Shoes', 'Winter Jacket', 'Baseball Cap',
    'Sunglasses', 'Leather Belt', 'Sports Socks', 'Yoga Mat', 'Backpack',
    'Table Lamp', 'Coffee Maker', 'Wall Clock', 'Throw Pillow', 'Plant Pot',
    'Dining Chair', 'Bookshelf', 'Area Rug', 'Picture Frame', 'Candle Set',
    'Tennis Racket', 'Basketball', 'Dumbbell Set', 'Resistance Bands', 'Bicycle Helmet',
    'Mystery Novel', 'Cookbook', 'Self-Help Book', 'Board Game', 'Puzzle Set'
  ];

  let discountedCount = 0;
  for (let i = 0; i < 40; i++) {
    const hasDiscount = i < 15; // First 15 products get discount
    await prisma.product.create({
      data: {
        name: productNames[i],
        description: `High-quality ${productNames[i].toLowerCase()} perfect for everyday use. Great value for money!`,
        price: Math.floor(Math.random() * 200) + 20,
        discount: hasDiscount ? 15 : 0,
        image: `https://picsum.photos/seed/${i + 1}/400/300`,
        category: categories[Math.floor(Math.random() * categories.length)],
        stock: Math.floor(Math.random() * 100) + 10,
      },
    });
    if (hasDiscount) discountedCount++;
  }

  console.log(`✅ Created 40 products (${discountedCount} with 15% discount)\n`);

  console.log('🎉 Production database seeded successfully!\n');
  console.log('📊 Summary:');
  console.log('   - Users: 3 (Admin, Manager, User)');
  console.log('   - Products: 40 (15 with 15% off)');
  console.log('   - Default password: password123\n');
  console.log('🔐 Remember to change passwords in production!\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

