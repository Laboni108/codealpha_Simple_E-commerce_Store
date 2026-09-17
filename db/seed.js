// db/seed.js
// Run with: npm run seed
// Populates the database with sample products. Safe to re-run (it replaces the products list).

const db = require('./database');

const products = [
  {
    id: 1,
    name: 'Wireless Headphones',
    price: 59.99,
    category: 'Electronics',
    image: '/img/headphones.jpg',
    description: 'Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cushions for all-day comfort.',
    stock: 25,
  },
  {
    id: 2,
    name: 'Smart Watch',
    price: 129.99,
    category: 'Electronics',
    image: '/img/smartwatch.webp',
    description: 'Fitness-focused smartwatch with heart-rate monitoring, GPS tracking, sleep analysis, and a always-on AMOLED display.',
    stock: 15,
  },
  {
    id: 3,
    name: 'Running Shoes',
    price: 89.5,
    category: 'Sportswear',
    image: '/img/shoes.jpg',
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh uppers, built for daily training miles.',
    stock: 40,
  },
  {
    id: 4,
    name: 'Backpack',
    price: 45.0,
    category: 'Accessories',
    image: '/img/backpack.avif',
    description: 'Water-resistant 25L backpack with a padded 15" laptop sleeve, multiple organizer pockets, and reinforced stitching.',
    stock: 30,
  },
  {
    id: 5,
    name: 'Coffee Maker',
    price: 74.99,
    category: 'Home',
    image: '/img/coffee.avif',
    description: 'Programmable 12-cup drip coffee maker with a built-in grinder, keep-warm plate, and reusable gold-tone filter.',
    stock: 18,
  },
  {
    id: 6,
    name: 'Desk Lamp',
    price: 22.99,
    category: 'Home',
    image: '/img/lamp.jpg',
    description: 'Adjustable LED desk lamp with 5 brightness levels, 3 color temperatures, and a USB charging port at the base.',
    stock: 50,
  },
  {
    id: 7,
    name: 'Yoga Mat',
    price: 28.0,
    category: 'Sportswear',
    image: '/img/yoga.webp',
    description: 'Extra-thick non-slip yoga mat made from eco-friendly TPE material, includes a carrying strap.',
    stock: 60,
  },
  {
    id: 8,
    name: 'Bluetooth Speaker',
    price: 39.99,
    category: 'Electronics',
    image: '/img/speaker.webp',
    description: 'Portable waterproof Bluetooth speaker with 12-hour playtime and deep bass for indoor or outdoor use.',
    stock: 35,
  },
  {
    id: 9,
    name: 'Sunglasses',
    price: 18.5,
    category: 'Accessories',
    image: '/img/sunglasses.jpg',
    description: 'Polarized UV400 sunglasses with a lightweight frame, ideal for driving, sports, or everyday wear.',
    stock: 45,
  },
  {
    id: 10,
    name: 'Ceramic Mug Set',
    price: 24.0,
    category: 'Home',
    image: '/img/mugs.jpg',
    description: 'Set of 4 handcrafted ceramic mugs, microwave and dishwasher safe, each holding 12oz.',
    stock: 22,
  },
  {
    id: 11,
    name: 'Fitness Resistance Bands',
    price: 15.99,
    category: 'Sportswear',
    image: '/img/fitnessband.jpg',
    description: 'Set of 5 latex resistance bands with varying resistance levels, includes a door anchor and carry pouch.',
    stock: 55,
  },
  {
    id: 12,
    name: 'Leather Wallet',
    price: 34.99,
    category: 'Accessories',
    image: '/img/walllet.jpg',
    description: 'Slim genuine-leather bifold wallet with RFID-blocking lining and 8 card slots.',
    stock: 28,
  },
];

db.set('products', products).write();
console.log(`Seeded ${products.length} products.`);
