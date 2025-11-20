/**
 * Force Reseed Script - Deletes all products and users, then reseeds
 * Use this when you want to completely refresh your database
 * 
 * Usage: npm run prisma:reseed
 */

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🗑️  Deleting all existing data...\n');

  // Delete all products and users
  await prisma.product.deleteMany({});
  await prisma.user.deleteMany({});

  console.log('✅ All data deleted.\n');
  console.log('🌱 Starting fresh seed...\n');

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

  console.log('✅ Created 3 users (Admin, Manager, User)\n');

  // Create 40 products (15 with 15% discount strategically placed)
  console.log('📦 Creating products...\n');
  
  const productData = [
    // Electronics (7 products) - 3 with discount
    { name: 'Wireless Headphones', category: 'Electronics', price: 79.99, description: 'Premium noise-canceling wireless headphones with 30-hour battery life.', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop', discount: true },
    { name: 'Smart Watch', category: 'Electronics', price: 199.99, description: 'Fitness tracking smartwatch with heart rate monitor and GPS.', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop', discount: false },
    { name: 'Bluetooth Speaker', category: 'Electronics', price: 49.99, description: 'Portable waterproof speaker with 360° sound and 12-hour playtime.', image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&h=300&fit=crop', discount: true },
    { name: 'USB-C Cable 6ft', category: 'Electronics', price: 12.99, description: 'Fast charging braided USB-C cable compatible with most devices.', image: 'https://images.unsplash.com/photo-1591290619762-c588f1f20c4d?w=400&h=300&fit=crop', discount: false },
    { name: 'Wireless Mouse', category: 'Electronics', price: 24.99, description: 'Ergonomic wireless mouse with precision tracking and long battery life.', image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop', discount: true },
    { name: 'Phone Charger Stand', category: 'Electronics', price: 29.99, description: 'Fast wireless charging stand with adjustable viewing angle.', image: 'https://images.unsplash.com/photo-1591033594735-dde4f632ecae?w=400&h=300&fit=crop', discount: false },
    { name: 'LED Desk Lamp', category: 'Electronics', price: 34.99, description: 'Smart LED lamp with adjustable brightness and color temperature.', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&h=300&fit=crop', discount: false },

    // Clothing (7 products) - 3 with discount
    { name: 'Cotton T-Shirt', category: 'Clothing', price: 19.99, description: 'Comfortable 100% cotton t-shirt available in multiple colors.', image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop', discount: false },
    { name: 'Denim Jeans', category: 'Clothing', price: 59.99, description: 'Classic fit denim jeans with stretch comfort and timeless style.', image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=300&fit=crop', discount: true },
    { name: 'Running Shoes', category: 'Clothing', price: 89.99, description: 'Lightweight athletic shoes with cushioned sole and breathable mesh.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop', discount: true },
    { name: 'Winter Jacket', category: 'Clothing', price: 129.99, description: 'Insulated waterproof jacket perfect for cold weather.', image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=300&fit=crop', discount: false },
    { name: 'Baseball Cap', category: 'Clothing', price: 24.99, description: 'Adjustable cotton baseball cap with embroidered logo.', image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=300&fit=crop', discount: true },
    { name: 'Leather Belt', category: 'Clothing', price: 34.99, description: 'Genuine leather belt with classic buckle, reversible design.', image: 'https://images.unsplash.com/photo-1624222247344-550fb60583c2?w=400&h=300&fit=crop', discount: false },
    { name: 'Athletic Socks 6-Pack', category: 'Clothing', price: 16.99, description: 'Moisture-wicking athletic socks with arch support.', image: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=400&h=300&fit=crop', discount: false },

    // Home & Garden (7 products) - 3 with discount
    { name: 'Coffee Maker', category: 'Home & Garden', price: 89.99, description: 'Programmable 12-cup coffee maker with auto-shutoff feature.', image: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop', discount: true },
    { name: 'Throw Pillow Set', category: 'Home & Garden', price: 29.99, description: 'Decorative throw pillows with premium soft covers, set of 2.', image: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=300&fit=crop', discount: false },
    { name: 'Indoor Plant Pot', category: 'Home & Garden', price: 22.99, description: 'Ceramic plant pot with drainage tray, perfect for succulents.', image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400&h=300&fit=crop', discount: true },
    { name: 'Wall Clock', category: 'Home & Garden', price: 39.99, description: 'Modern silent wall clock with clear numbers and sleek design.', image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&h=300&fit=crop', discount: false },
    { name: 'Scented Candle Set', category: 'Home & Garden', price: 24.99, description: 'Aromatherapy candles in lavender, vanilla, and eucalyptus scents.', image: 'https://images.unsplash.com/photo-1602874801006-94c8f0d8f7ae?w=400&h=300&fit=crop', discount: true },
    { name: 'Kitchen Knife Set', category: 'Home & Garden', price: 79.99, description: 'Professional 8-piece stainless steel knife set with wooden block.', image: 'https://images.unsplash.com/photo-1593618998160-e34014e67546?w=400&h=300&fit=crop', discount: false },
    { name: 'Garden Tool Set', category: 'Home & Garden', price: 44.99, description: 'Complete 10-piece gardening tool set with carrying bag.', image: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=300&fit=crop', discount: false },

    // Sports (6 products) - 2 with discount
    { name: 'Yoga Mat', category: 'Sports', price: 29.99, description: 'Non-slip exercise yoga mat with carrying strap, 6mm thick.', image: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=300&fit=crop', discount: true },
    { name: 'Tennis Racket', category: 'Sports', price: 79.99, description: 'Professional tennis racket with graphite frame and comfortable grip.', image: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=400&h=300&fit=crop', discount: false },
    { name: 'Basketball', category: 'Sports', price: 34.99, description: 'Official size basketball with superior grip and bounce.', image: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop', discount: true },
    { name: 'Dumbbell Set', category: 'Sports', price: 149.99, description: 'Adjustable dumbbell set 5-25 lbs with storage rack.', image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&h=300&fit=crop', discount: false },
    { name: 'Resistance Bands', category: 'Sports', price: 19.99, description: 'Set of 5 resistance bands with different strength levels.', image: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400&h=300&fit=crop', discount: false },
    { name: 'Bicycle Helmet', category: 'Sports', price: 44.99, description: 'Lightweight cycling helmet with adjustable fit and ventilation.', image: 'https://images.unsplash.com/photo-1614016932005-185d64e8c1e5?w=400&h=300&fit=crop', discount: false },

    // Books (7 products) - 2 with discount
    { name: 'The Midnight Library', category: 'Books', price: 16.99, description: 'Bestselling fiction novel about life, choices, and second chances.', image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop', discount: true },
    { name: 'Atomic Habits', category: 'Books', price: 18.99, description: 'Practical guide to building good habits and breaking bad ones.', image: 'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&h=300&fit=crop', discount: false },
    { name: 'The Thursday Murder Club', category: 'Books', price: 15.99, description: 'Mystery novel about four friends who meet weekly to solve cold cases.', image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop', discount: true },
    { name: 'Mediterranean Cookbook', category: 'Books', price: 24.99, description: 'Collection of authentic Mediterranean recipes with beautiful photography.', image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=300&fit=crop', discount: false },
    { name: 'Sapiens', category: 'Books', price: 19.99, description: 'Brief history of humankind from the Stone Age to modern times.', image: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?w=400&h=300&fit=crop', discount: false },
    { name: 'The Psychology of Money', category: 'Books', price: 17.99, description: 'Timeless lessons on wealth, greed, and happiness.', image: 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400&h=300&fit=crop', discount: false },
    { name: 'Where the Crawdads Sing', category: 'Books', price: 16.99, description: 'Coming-of-age mystery set in the marshes of North Carolina.', image: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=400&h=300&fit=crop', discount: false },

    // Toys (6 products) - 2 with discount
    { name: 'LEGO City Building Set', category: 'Toys', price: 49.99, description: '500-piece LEGO set with fire station and vehicles.', image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400&h=300&fit=crop', discount: true },
    { name: 'Board Game Bundle', category: 'Toys', price: 39.99, description: 'Classic family board game collection including favorites.', image: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?w=400&h=300&fit=crop', discount: false },
    { name: 'Puzzle 1000 Pieces', category: 'Toys', price: 19.99, description: 'Challenging jigsaw puzzle with beautiful landscape artwork.', image: 'https://images.unsplash.com/photo-1587731556938-38755b4803a6?w=400&h=300&fit=crop', discount: true },
    { name: 'Remote Control Car', category: 'Toys', price: 59.99, description: 'High-speed RC car with rechargeable battery and controller.', image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', discount: false },
    { name: 'Art Supply Kit', category: 'Toys', price: 34.99, description: 'Complete drawing and painting set with 50+ pieces.', image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=300&fit=crop', discount: false },
    { name: 'Action Figure Set', category: 'Toys', price: 29.99, description: 'Collectible action figures with accessories, set of 4.', image: 'https://images.unsplash.com/photo-1581716867443-8946854c56d7?w=400&h=300&fit=crop', discount: false },
  ];

  for (let i = 0; i < productData.length; i++) {
    const item = productData[i];
    await prisma.product.create({
      data: {
        name: item.name,
        description: item.description,
        price: item.price,
        discount: item.discount ? 15 : 0,
        image: item.image,
        category: item.category,
        stock: Math.floor(Math.random() * 100) + 10,
      },
    });
  }

  console.log(`✅ Created 40 products (15 with 15% discount)\n`);
  console.log('🎉 Database reseeded successfully!\n');
}

main()
  .then(async () => {
    await prisma.$disconnect();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error('❌ Error reseeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });

