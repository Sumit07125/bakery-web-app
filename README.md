# The Cake Shop / Swad Dhulekar - Bakery Web App

This is a full-stack web application for an online bakery, "The Cake Shop" (also referred to as "Swad Dhulekar"). It provides a complete e-commerce experience, allowing users to browse products, manage their cart, and place orders. It also includes a full admin panel for managing products and customer orders.

## Project Documentation (with Screenshots)

All project information, including detailed explanations and screenshots for every feature (user pages, admin panel, cart, profile, etc.), is available in the project PDF.

**[[Click here to view the Project PDF (se2.pdf)](https://drive.google.com/file/d/1BDPBTrB4IzYEZtn0isncR4dZbf3affQj/view?usp=sharing)]( Bakery Web App.pdf)**

## Features

This application is divided into two main parts: the user-facing storefront and the admin backend.

### User Features
* **User Registration:** New customers can create an account by providing their personal details.
* **User Login:** Registered users can securely log in to access their accounts.
* **Product Catalog:** A main page displays all available bakery items, such as cakes, pastries, and breads, with their prices.
* **Search:** Users can search for specific treats.
* **User Profile:** Logged-in users can view and edit their profile information, including name, email, address, and phone number.
* **Shopping Cart:** Users can add products to their cart, adjust item quantities, and see a summary of their total.
* **Checkout:** Users can proceed to checkout, which creates a bill/order in the system.
* **Order History:** Users can view all their past and current orders ("My Bills") and check their status.

### Admin Features
* **Admin Login:** A separate, secure login page for administrators.
* **Admin Dashboard:** A central panel for admins to manage the store.
* **Add Products:** Admins can add new products to the inventory, including name, price, quantity, and an image URL.
* **View Products:** Admins can view a list of all products in the database.
* **Manage Orders (Bills):** Admins can view all customer bills, check order details, and update the order status (e.g., Pending, Inprogress, Delivered).

## Technologies Used

* **Backend:** Node.js, Express.js
* **Database:** MySQL
* **Frontend (Templating):** EJS (Embedded JavaScript)
* **Session Management:** express-session
* **Database Driver:** mysql2

## Setup and Installation

To run this project locally, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Sumit07125/bakery-web-app.git](https://github.com/Sumit07125/bakery-web-app.git)
    cd bakery-web-app
    ```

2.  **Set up the Database:**
    * Ensure you have MySQL server running.
    * Create a new database. You can use the `bakery_app.sql` file to create the database and all its tables:
        ```sql
        CREATE DATABASE IF NOT EXISTS bakery_app;
        USE bakery_app;
        ```
    * Run the rest of the queries in `bakery_app.sql` to create the `users`, `admin`, `products`, `cart`, and `bills` tables and insert the sample data.

3.  **Configure Database Connection:**
    * Open the `bakery_app/db.js` file.
    * Update the `host`, `user`, `password`, and `database` fields with your local MySQL credentials.

4.  **Install Dependencies:**
    * From the project's root directory (which contains `package.json`), run:
        ```bash
        npm install
        ```

5.  **Run the Application:**
    * You must be in the main project folder (`bakery-web-app`) to run this command.
    ```bash
    node bakery_app/app.js
    ```
    * The application will be running at `http://localhost:3000`.
