// db/seed.js
// Run with: npm run seed
// Wipes and repopulates the products collection with sample data.
// (Users and orders are left untouched, so you don't lose test accounts/orders by reseeding.)

const connectDB = require('./connect');
const Product = require('./models/Product');

const products = [
  {
    name: 'Wireless Headphones',
    price: 59.99,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/headphones/400/300',
    description: 'Over-ear wireless headphones with active noise cancellation, 30-hour battery life, and plush memory-foam ear cushions for all-day comfort.',
    stock: 25,
  },
  {
    name: 'Smart Watch',
    price: 129.99,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/smartwatch/400/300',
    description: 'Fitness-focused smartwatch with heart-rate monitoring, GPS tracking, sleep analysis, and a always-on AMOLED display.',
    stock: 15,
  },
  {
    name: 'Running Shoes',
    price: 89.5,
    category: 'Sportswear',
    image: 'https://picsum.photos/seed/shoes/400/300',
    description: 'Lightweight running shoes with responsive cushioning and breathable mesh uppers, built for daily training miles.',
    stock: 40,
  },
  {
    name: 'Backpack',
    price: 45.0,
    category: 'Accessories',
    image: 'https://picsum.photos/seed/backpack/400/300',
    description: 'Water-resistant 25L backpack with a padded 15" laptop sleeve, multiple organizer pockets, and reinforced stitching.',
    stock: 30,
  },
  {
    name: 'Coffee Maker',
    price: 74.99,
    category: 'Home',
    image: 'https://picsum.photos/seed/coffeemaker/400/300',
    description: 'Programmable 12-cup drip coffee maker with a built-in grinder, keep-warm plate, and reusable gold-tone filter.',
    stock: 18,
  },
  {
    name: 'Desk Lamp',
    price: 22.99,
    category: 'Home',
    image: 'https://picsum.photos/seed/desklamp/400/300',
    description: 'Adjustable LED desk lamp with 5 brightness levels, 3 color temperatures, and a USB charging port at the base.',
    stock: 50,
  },
  {
    name: 'Yoga Mat',
    price: 28.0,
    category: 'Sportswear',
    image: 'https://picsum.photos/seed/yogamat/400/300',
    description: 'Extra-thick non-slip yoga mat made from eco-friendly TPE material, includes a carrying strap.',
    stock: 60,
  },
  {
    name: 'Bluetooth Speaker',
    price: 39.99,
    category: 'Electronics',
    image: 'https://picsum.photos/seed/speaker/400/300',
    description: 'Portable waterproof Bluetooth speaker with 12-hour playtime and deep bass for indoor or outdoor use.',
    stock: 35,
  },
  {
    name: 'Sunglasses',
    price: 18.5,
    category: 'Accessories',
    image: 'https://picsum.photos/seed/sunglasses/400/300',
    description: 'Polarized UV400 sunglasses with a lightweight frame, ideal for driving, sports, or everyday wear.',
    stock: 45,
  },
  {
    name: 'Ceramic Mug Set',
    price: 24.0,
    category: 'Home',
    image: 'https://picsum.photos/seed/mugset/400/300',
    description: 'Set of 4 handcrafted ceramic mugs, microwave and dishwasher safe, each holding 12oz.',
    stock: 22,
  },
  {
    name: 'Fitness Resistance Bands',
    price: 15.99,
    category: 'Sportswear',
    image: 'https://picsum.photos/seed/bands/400/300',
    description: 'Set of 5 latex resistance bands with varying resistance levels, includes a door anchor and carry pouch.',
    stock: 55,
  },
  {
    name: 'Leather Wallet',
    price: 34.99,
    category: 'Accessories',
    image: 'https://picsum.photos/seed/wallet/400/300',
    description: 'Slim genuine-leather bifold wallet with RFID-blocking lining and 8 card slots.',
    stock: 28,
  },
];

async function seed() {
  const conn = await connectDB();
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log(`Seeded ${products.length} products.`);
  await conn.close();
  process.exit(0);
}

seed().catch((err) => {
  console.error('Seeding failed:', err.message);
  process.exit(1);
});
