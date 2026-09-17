# ShopEasy — Basic E-Commerce Site

A full-stack e-commerce demo built with **Express.js** (Node.js) on the backend and plain **HTML/CSS/JavaScript** on the frontend.

## Features

- **Product listings** — browsable grid with search and category filtering
- **Product details page** — full description, stock, quantity picker
- **Shopping cart** — session-based, works for guests, persists across pages
- **User registration/login** — passwords hashed with bcrypt, session cookies
- **Order processing** — checkout with shipping address, stock is validated and decremented, order history per user
- **Database** — JSON-file database (via `lowdb`) storing users, products, and orders. It's a real persistence layer (not in-memory/mock) but swappable — see "Using a real database" below.

## Project structure

```
ecommerce-app/
├── server.js              # Express app entry point
├── db/
│   ├── database.js        # Database connection (lowdb)
│   └── seed.js            # Sample product data
├── middleware/
│   └── auth.js            # requireAuth guard
├── routes/
│   ├── auth.js             # register / login / logout / me
│   ├── products.js         # product listing & detail
│   ├── cart.js              # cart CRUD (session-based)
│   └── orders.js            # checkout & order history
├── public/                 # static frontend
│   ├── index.html           # product listing
│   ├── product.html          # product detail
│   ├── cart.html              # shopping cart
│   ├── checkout.html           # shipping + place order
│   ├── login.html
│   ├── register.html
│   ├── orders.html             # order history
│   ├── css/style.css
│   └── js/main.js               # shared fetch helper + nav bar
└── data/db.json             # the JSON "database" file (created on first run)
```

## Getting started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Seed the product catalog** (populates 12 sample products)
   ```bash
   npm run seed
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. Open **http://localhost:3000** in your browser.

The server runs on port `3000` by default; set the `PORT` environment variable to change it.

## How it works

- **Auth**: `express-session` issues an `httpOnly` cookie on login/register. `bcryptjs` hashes passwords (never stored in plain text).
- **Cart**: stored in the session (`req.session.cart`), so guests can add items before logging in. Checkout requires login.
- **Checkout**: validates each cart item still has enough stock, decrements stock, creates an `order` record, and clears the cart.
- **Frontend**: no build step or framework — plain HTML pages each load `/js/main.js` (nav bar + tiny `fetch` wrapper) and call the JSON API directly.

## API reference

| Method | Endpoint              | Description                          | Auth required |
|--------|-----------------------|---------------------------------------|----------------|
| POST   | `/api/auth/register`  | Create an account                     | No             |
| POST   | `/api/auth/login`     | Log in                                | No             |
| POST   | `/api/auth/logout`    | Log out                               | No             |
| GET    | `/api/auth/me`        | Get current user                      | No             |
| GET    | `/api/products`       | List products (`?search=&category=`)  | No             |
| GET    | `/api/products/:id`   | Product detail                        | No             |
| GET    | `/api/cart`           | View cart                             | No             |
| POST   | `/api/cart`           | Add item `{ productId, qty }`         | No             |
| PUT    | `/api/cart/:productId`| Update quantity `{ qty }`             | No             |
| DELETE | `/api/cart/:productId`| Remove item                           | No             |
| POST   | `/api/orders`         | Checkout `{ shippingAddress }`        | **Yes**        |
| GET    | `/api/orders`         | List my orders                        | **Yes**        |
| GET    | `/api/orders/:id`     | Order detail                          | **Yes**        |

## Using a real database

The whole app only talks to `db/database.js`. To swap in Postgres, MySQL, or MongoDB in production:
1. Replace the contents of `db/database.js` with your driver/ORM setup (e.g. Prisma, Sequelize, Mongoose).
2. Update the `db.get(...).find(...)`/`.push(...)`/`.write()` calls in `routes/*.js` to your new API.
3. Everything else (routes, middleware, frontend) stays the same.

## Notes / production considerations

This is built as a learning/demo project. Before deploying for real use, you'd want to:
- Set a strong, secret `SESSION_SECRET` env var and use `secure: true` cookies behind HTTPS
- Move to a real database with proper transactions (to avoid race conditions on stock)
- Add input validation/rate limiting, CSRF protection, and HTTPS
- Add a payment gateway (Stripe, PayPal, etc.) — this demo simulates order placement without real payment
