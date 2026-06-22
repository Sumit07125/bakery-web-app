require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
      secure: false,
    },
  })
);

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const billRoutes = require('./routes/billRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Use routes
app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/', cartRoutes);
app.use('/', billRoutes);
app.use('/', paymentRoutes);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
