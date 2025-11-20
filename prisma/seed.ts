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
  // Organized by category with realistic products
  const productData = [
    // Electronics (7 products) - First 5 with discount
    { name: 'Wireless Headphones', category: 'Electronics', price: 79.99, description: 'Premium noise-canceling wireless headphones with 30-hour battery life.' },
    { name: 'Smart Watch', category: 'Electronics', price: 199.99, description: 'Fitness tracking smartwatch with heart rate monitor and GPS.' },
    { name: 'Bluetooth Speaker', category: 'Electronics', price: 49.99, description: 'Portable waterproof speaker with 360° sound and 12-hour playtime.' },
    { name: 'USB-C Cable 6ft', category: 'Electronics', price: 12.99, description: 'Fast charging braided USB-C cable compatible with most devices.' },
    { name: 'Wireless Mouse', category: 'Electronics', price: 24.99, description: 'Ergonomic wireless mouse with precision tracking and long battery life.' },
    { name: 'Phone Charger Stand', category: 'Electronics', price: 29.99, description: 'Fast wireless charging stand with adjustable viewing angle.' },
    { name: 'LED Desk Lamp', category: 'Electronics', price: 34.99, description: 'Smart LED lamp with adjustable brightness and color temperature.' },

    // Clothing (7 products) - Next 5 with discount (6-10)
    { name: 'Cotton T-Shirt', category: 'Clothing', price: 19.99, description: 'Comfortable 100% cotton t-shirt available in multiple colors.' },
    { name: 'Denim Jeans', category: 'Clothing', price: 59.99, description: 'Classic fit denim jeans with stretch comfort and timeless style.' },
    { name: 'Running Shoes', category: 'Clothing', price: 89.99, description: 'Lightweight athletic shoes with cushioned sole and breathable mesh.' },
    { name: 'Winter Jacket', category: 'Clothing', price: 129.99, description: 'Insulated waterproof jacket perfect for cold weather.' },
    { name: 'Baseball Cap', category: 'Clothing', price: 24.99, description: 'Adjustable cotton baseball cap with embroidered logo.' },
    { name: 'Leather Belt', category: 'Clothing', price: 34.99, description: 'Genuine leather belt with classic buckle, reversible design.' },
    { name: 'Athletic Socks 6-Pack', category: 'Clothing', price: 16.99, description: 'Moisture-wicking athletic socks with arch support.' },

    // Home & Garden (7 products) - Next 5 with discount (11-15)
    { name: 'Coffee Maker', category: 'Home & Garden', price: 89.99, description: 'Programmable 12-cup coffee maker with auto-shutoff feature.' },
    { name: 'Throw Pillow Set', category: 'Home & Garden', price: 29.99, description: 'Decorative throw pillows with premium soft covers, set of 2.' },
    { name: 'Indoor Plant Pot', category: 'Home & Garden', price: 22.99, description: 'Ceramic plant pot with drainage tray, perfect for succulents.' },
    { name: 'Wall Clock', category: 'Home & Garden', price: 39.99, description: 'Modern silent wall clock with clear numbers and sleek design.' },
    { name: 'Scented Candle Set', category: 'Home & Garden', price: 24.99, description: 'Aromatherapy candles in lavender, vanilla, and eucalyptus scents.' },
    { name: 'Kitchen Knife Set', category: 'Home & Garden', price: 79.99, description: 'Professional 8-piece stainless steel knife set with wooden block.' },
    { name: 'Garden Tool Set', category: 'Home & Garden', price: 44.99, description: 'Complete 10-piece gardening tool set with carrying bag.' },

    // Sports (6 products) - No discount
    { name: 'Yoga Mat', category: 'Sports', price: 29.99, description: 'Non-slip exercise yoga mat with carrying strap, 6mm thick.' },
    { name: 'Tennis Racket', category: 'Sports', price: 79.99, description: 'Professional tennis racket with graphite frame and comfortable grip.' },
    { name: 'Basketball', category: 'Sports', price: 34.99, description: 'Official size basketball with superior grip and bounce.' },
    { name: 'Dumbbell Set', category: 'Sports', price: 149.99, description: 'Adjustable dumbbell set 5-25 lbs with storage rack.' },
    { name: 'Resistance Bands', category: 'Sports', price: 19.99, description: 'Set of 5 resistance bands with different strength levels.' },
    { name: 'Bicycle Helmet', category: 'Sports', price: 44.99, description: 'Lightweight cycling helmet with adjustable fit and ventilation.' },

    // Books (7 products) - No discount
    { name: 'The Midnight Library', category: 'Books', price: 16.99, description: 'Bestselling fiction novel about life, choices, and second chances.' },
    { name: 'Atomic Habits', category: 'Books', price: 18.99, description: 'Practical guide to building good habits and breaking bad ones.' },
    { name: 'The Thursday Murder Club', category: 'Books', price: 15.99, description: 'Mystery novel about four friends who meet weekly to solve cold cases.' },
    { name: 'Mediterranean Cookbook', category: 'Books', price: 24.99, description: 'Collection of authentic Mediterranean recipes with beautiful photography.' },
    { name: 'Sapiens', category: 'Books', price: 19.99, description: 'Brief history of humankind from the Stone Age to modern times.' },
    { name: 'The Psychology of Money', category: 'Books', price: 17.99, description: 'Timeless lessons on wealth, greed, and happiness.' },
    { name: 'Where the Crawdads Sing', category: 'Books', price: 16.99, description: 'Coming-of-age mystery set in the marshes of North Carolina.' },

    // Toys (6 products) - No discount
    { name: 'LEGO City Building Set', category: 'Toys', price: 49.99, description: '500-piece LEGO set with fire station and vehicles.' },
    { name: 'Board Game Bundle', category: 'Toys', price: 39.99, description: 'Classic family board game collection including favorites.' },
    { name: 'Puzzle 1000 Pieces', category: 'Toys', price: 19.99, description: 'Challenging jigsaw puzzle with beautiful landscape artwork.' },
    { name: 'Remote Control Car', category: 'Toys', price: 59.99, description: 'High-speed RC car with rechargeable battery and controller.' },
    { name: 'Art Supply Kit', category: 'Toys', price: 34.99, description: 'Complete drawing and painting set with 50+ pieces.' },
    { name: 'Action Figure Set', category: 'Toys', price: 29.99, description: 'Collectible action figures with accessories, set of 4.' },
  ];

  const products = [];
  for (let i = 0; i < productData.length; i++) {
    const hasDiscount = i < 15; // First 15 products get discount
    const item = productData[i];
    const product = await prisma.product.create({
      data: {
        name: item.name,
        description: item.description,
        price: item.price,
        discount: hasDiscount ? 15 : 0,
        image: `https://picsum.photos/seed/${i + 1}/400/300`,
        category: item.category,
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

