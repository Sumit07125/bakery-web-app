# 🍰 Swad Dhulekar - Premium Bakery Web App

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)
![EJS](https://img.shields.io/badge/EJS-B4CA65?style=for-the-badge&logo=ejs&logoColor=black)
![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=white)

> **🌟 Live Demo:** [View Live Project Here](#) *(Update this link when hosted)*

Welcome to **Swad Dhulekar / The Cake Shop**, a full-stack, MVC-architected e-commerce bakery application. Designed with modern aesthetics, glassmorphism UI, and robust backend architecture, this application provides a seamless shopping experience for sweet tooths and an efficient management portal for admins.

![Home Page](Images/Home%20Page.jpeg)

---

## ✨ Core Features

| Feature | Description | Status |
| :--- | :--- | :---: |
| **💳 Online Payment Integration** | Secure and seamless checkout experience powered by Razorpay. Supports both Online Payments and Cash on Delivery (COD). | ✅ |
| **🚚 Live Order Tracking** | Real-time visual progress bar tracking orders from "Received" ➔ "Baking" ➔ "Out for Delivery" ➔ "Delivered". | ✅ |
| **⭐ User Review System** | Authenticated users can leave 1-5 star ratings and written reviews on products they love. Includes auto-updating average scores. | ✅ |
| **🔍 Dynamic Filtering** | Interactive category filters (Cakes, Pastries, etc.) that instantly sort products with smooth auto-scrolling navigation. | ✅ |
| **🎁 Smart Discounts** | Automated promotional discounts calculated at checkout to enhance user retention and provide a delightful UX. | ✅ |
| **👤 Premium User Profiles** | Highly customized, aesthetic user dashboard with dynamic UI-avatars, address management, and order history tracking. | ✅ |
| **🔒 Admin Dashboard** | Secure portal for bakery owners to add/edit products, manage stock, and manually update final delivery statuses. | ✅ |

---

## 💳 Razorpay Payment Simulation

We have integrated a **Razorpay Standard Web Checkout** simulation into the application. 

When a user proceeds to checkout from their cart, the application:
1. Calls a secure backend API (`/api/create-order`) to generate a unique Razorpay order ID.
2. Opens the official Razorpay payment modal directly on the frontend.
3. Upon a successful mock payment, sends the `razorpay_signature` back to our Node.js backend (`/api/verify-payment`) for SHA256 HMAC verification to ensure security.
4. Updates the user's bill status to "Paid" and clears their cart.

![Razorpay Payment Simulation](Images/Razerpay_payment.jpg)

---

## 🛠️ Technology Stack

- **Frontend:** HTML5, CSS3 (Custom properties, Glassmorphism), Bootstrap 5, EJS Templating
- **Backend:** Node.js, Express.js (MVC Pattern: Models, Views, Controllers, Routes)
- **Database:** MySQL (via `mysql2`)
- **Authentication:** Express-Session (Secure Cookie based)
- **Payment Gateway:** Razorpay Node SDK & Checkout.js
- **Tooling:** Nodemon, Dotenv

---

## 🚀 Getting Started (Local Development)

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16+)
- [MySQL](https://www.mysql.com/) Server

### 2. Installation & Setup
Clone the repository and install dependencies:
```bash
git clone https://github.com/Sumit07125/bakery-web-app.git
cd bakery-web-app
npm install
```

### 3. Environment Variables
Create a `.env` file in the root directory and configure your credentials:
```env
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=bakery_app
DB_PORT=3306

# Server Configuration
PORT=3000
SESSION_SECRET=your_super_secret_key

# Razorpay Keys (For Payments)
RAZORPAY_KEY_ID=your_test_key_id
RAZORPAY_KEY_SECRET=your_test_key_secret
```

### 4. Database Migration
Initialize your database schema and tables. 
*Note: Make sure your MySQL server is running and the `bakery_app` database is created before running these.*
```bash
# 1. Run the base SQL script in your MySQL Workbench or CLI
# source bakery_app.sql

# 2. Add description column to products
node migrate.js

# 3. Add reviews table and order_status
node apply_schema.js

# 4. (Optional) Seed dummy reviews for testing
node seed_reviews.js
```

### 5. Run the Application
```bash
npm start
```
Your app will now be running at `http://localhost:3000`!

---

## 👨‍💻 Developer Information

Built with ❤️ by **Sumit Mali**.  
For any inquiries or contributions, feel free to open an issue or pull request!

---
**Project Documentation:**
All project information, including detailed explanations and screenshots for every feature (user pages, admin panel, cart, profile, etc.), is available in the project PDF.

**[Click here to view the Project PDF (Bakery Web App.pdf)](Bakery%20Web%20App.pdf)**
