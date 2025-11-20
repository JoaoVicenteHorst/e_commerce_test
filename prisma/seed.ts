import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Create users
  const hashedPassword = await bcrypt.hash('password123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      name: 'Admin User',
      role: 'ADMIN',
    },
  });

  const manager = await prisma.user.upsert({
    where: { email: 'manager@example.com' },
    update: {},
    create: {
      email: 'manager@example.com',
      password: hashedPassword,
      name: 'Manager User',
      role: 'MANAGER',
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedPassword,
      name: 'Regular User',
      role: 'USER',
    },
  });

  console.log('Created users:', { admin, manager, user });

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

  console.log(`Created ${products.length} products`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

