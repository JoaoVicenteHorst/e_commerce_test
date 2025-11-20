import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// This route is for ONE-TIME production database seeding
// DELETE THIS FILE after seeding production database for security
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { secret } = body;

    // Security check - must match JWT_SECRET
    if (secret !== process.env.JWT_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid secret' },
        { status: 401 }
      );
    }

    // Check if already seeded (check if admin exists)
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@example.com' },
    });

    if (existingAdmin) {
      return NextResponse.json(
        { message: 'Database already seeded', alreadySeeded: true },
        { status: 200 }
      );
    }

    // Create users
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

    // Create 40 products (15 with 15% discount)
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

    const products = [];
    for (let i = 0; i < 40; i++) {
      const hasDiscount = i < 15; // First 15 products get discount
      const product = await prisma.product.create({
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
      products.push(product);
    }

    await prisma.$disconnect();

    return NextResponse.json({
      success: true,
      message: 'Production database seeded successfully!',
      data: {
        usersCreated: 3,
        productsCreated: products.length,
        productsWithDiscount: 15,
      },
    });
  } catch (error: any) {
    console.error('Seeding error:', error);
    await prisma.$disconnect();
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

