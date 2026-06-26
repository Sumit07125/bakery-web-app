require('dotenv').config();
const express = require('express');
const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mysqlPromise = require('mysql2/promise');

const pool = mysqlPromise.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  ssl: {
    minVersion: 'TLSv1.2',
    rejectUnauthorized: false
  }
});

const sessionStore = new MySQLStore({}, pool);

app.set('trust proxy', 1); // Trust first proxy (required for Vercel)
app.use(
  session({
    key: 'bakery_session',
    secret: process.env.SESSION_SECRET || "fallback_secret_key",
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const billRoutes = require('./routes/billRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const db = require('./db');

// Order updater is now called dynamically on route loads instead of a background interval

// Use routes
app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', billRoutes);
app.use('/', paymentRoutes);
app.use('/', reviewRoutes);

if (require.main === module) {
  app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
}

// Export for Vercel Serverless Functions
module.exports = app;
