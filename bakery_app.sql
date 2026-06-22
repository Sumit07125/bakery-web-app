-- Create Database
CREATE DATABASE IF NOT EXISTS bakery_app CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE bakery_app;

-- -----------------------------
-- Table: admin
-- -----------------------------
CREATE TABLE admin (
  admin_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  phone_no BIGINT NOT NULL
);

INSERT INTO admin (username, password, email, phone_no)
VALUES ('admin', '123', 'admin@gmail.com', 876700098);

-- -----------------------------
-- Table: users
-- -----------------------------
CREATE TABLE users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  address VARCHAR(2555) NOT NULL,
  age INT NOT NULL,
  phone_number VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  passward VARCHAR(255) NOT NULL
);

INSERT INTO users (name, address, age, phone_number, email, passward)
VALUES ('user', 'Dhule', 19, '9876543221', 'user@gmail.com', '123');

-- -----------------------------
-- Table: products
-- -----------------------------
CREATE TABLE products (
  product_id INT AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(100) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  quantity INT NOT NULL,
  img_url VARCHAR(2555) NOT NULL,
  description TEXT
);

INSERT INTO products (product_name, price, quantity, img_url, description) VALUES
('Mysore Pak', 450.00, 29, 'https://img.freepik.com/premium-photo/mysore-pak-indian-sweet-prepared-ghee_521733-12165.jpg', 'A rich, sweet, and melt-in-the-mouth traditional Indian delicacy made with generous amounts of ghee, sugar, and gram flour.'),
('Chocolate Cake', 650.00, 15, 'https://th.bing.com/th/id/OIP.XfKQb1ZbxyccGXEcWQ_VPgHaHa?pid=ImgDetMain', 'Decadent, moist chocolate cake layered with rich fudge frosting. Perfect for any celebration or a midnight craving.'),
('Red Velvet Cupcake', 120.00, 40, 'https://th.bing.com/th/id/OIP.GQTeiAV6zwOUSApmkyw6ngHaEK?pid=ImgDetMain', 'Classic moist red velvet cake topped with a generous swirl of tangy and sweet cream cheese frosting.'),
('Black Forest Pastry', 90.00, 50, 'https://www.ruchiskitchen.com/wp-content/uploads/2021/05/Eggless-Black-forest-pastry-02-1-683x1024.jpg', 'Traditional German dessert featuring layers of chocolate sponge cake, whipped cream, and luscious cherries.'),
('Pineapple Pastry', 85.00, 45, 'https://tse1.mm.bing.net/th/id/OIP.BwEYpj6Tpf7zJGLrdfPo1AHaJQ?pid=ImgDetMain', 'Light and refreshing sponge cake layered with fresh pineapple chunks and smooth vanilla cream.'),
('Butter Cookies', 250.00, 60, 'https://img.freepik.com/free-photo/butter-cookies_1339-1743.jpg', 'Classic, crumbly cookies made with premium butter that simply melt in your mouth. Perfect with tea or coffee.'),
('Rasgulla', 350.00, 35, 'https://th.bing.com/th/id/OIP.ibmTOU1t-Zl1LKlZUOAewgHaHa?pid=ImgDetMain', 'Soft, spongy, and juicy milk-solid balls soaked in a delicate sugar syrup infused with rose water.'),
('Kaju Katli', 600.00, 28, 'https://th.bing.com/th/id/OIP.d9OfVEfRsMxbvNYzOmiLLQHaE-?pid=ImgDetMain', 'A premium Indian sweet made from cashew nuts, sugar, and ghee, garnished with edible silver foil.'),
('Baklava', 700.00, 20, 'https://tse2.mm.bing.net/th/id/OIP.kFlIVDFW3aBxfcsX5jYV-QHaHa?pid=ImgDetMain', 'Rich, sweet pastry made of layers of filo dough filled with chopped nuts and sweetened with syrup or honey.'),
('Doughnut', 70.00, 55, 'https://tse4.mm.bing.net/th/id/OIP._MHjT_o_pe3ClSbSS6Te_AHaEo?pid=ImgDetMain', 'Freshly fried, pillowy soft doughnut glazed with a smooth and glossy sugary coating.'),
('Croissant', 90.00, 40, 'https://tse2.mm.bing.net/th/id/OIP.viZx5oefVmeeam9tdJDzbQHaG6?pid=ImgDetMain', 'Authentic French-style pastry featuring flaky, buttery layers with a beautifully crisp exterior and soft interior.'),
('Fruit Tart', 300.00, 22, 'https://images.squarespace-cdn.com/content/v1/533f584fe4b0f77e1bd2e4d1/1624992895865-BEP5PAI4R7PYBQU9T0TW/summer.fruit.tart.1_butteryum.jpg', 'A crisp buttery tart shell filled with rich custard and topped with a colorful array of fresh seasonal fruits.'),
('Cheese Cake', 550.00, 18, 'https://tse2.mm.bing.net/th/id/OIP.7s4_AWNCD-sRn4BmTu3V_AHaHa?pid=ImgDetMain', 'Creamy, smooth New York style cheesecake with a buttery graham cracker crust and a hint of vanilla.'),
('Banana Bread', 200.00, 25, 'https://tse3.mm.bing.net/th/id/OIP.JnSG7aGGyv5dHHfYkyVoDgHaLH?pid=ImgDetMain', 'Moist, sweet bread loaded with ripe bananas and a touch of cinnamon, baked to golden perfection.'),
('Plum Cake', 450.00, 30, 'https://tse4.mm.bing.net/th/id/OIP.fdJSO7a8pXARFJqqJT1xigHaFj?pid=ImgDetMain', 'Traditional rich fruit cake loaded with rum-soaked dry fruits and warm spices. A holiday classic!');

-- -----------------------------
-- Table: cart
-- -----------------------------
CREATE TABLE cart (
  cart_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE
);

INSERT INTO cart (user_id, product_id, quantity) VALUES (1, 11, 1);

-- -----------------------------
-- Table: bills
-- -----------------------------
CREATE TABLE bills (
  bill_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  total_amount DECIMAL(10,2) DEFAULT NULL,
  status VARCHAR(20) DEFAULT 'Pending',
  bill_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  p1 INT DEFAULT NULL,
  q1 INT DEFAULT NULL,
  p2 INT DEFAULT NULL,
  q2 INT DEFAULT NULL,
  p3 INT DEFAULT NULL,
  q3 INT DEFAULT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  FOREIGN KEY (p1) REFERENCES products(product_id) ON DELETE SET NULL,
  FOREIGN KEY (p2) REFERENCES products(product_id) ON DELETE SET NULL,
  FOREIGN KEY (p3) REFERENCES products(product_id) ON DELETE SET NULL
);

INSERT INTO bills (user_id, total_amount, status, bill_date, p1, q1, p2, q2, p3, q3) VALUES
(1, 535.00, 'Pending', '2025-10-03 13:00:30', 1, 1, 5, 1, NULL, NULL),
(1, 685.00, 'Inprogress', '2025-10-10 08:47:17', 5, 1, 6, 1, 7, 1),
(1, 770.00, 'Pending', '2025-10-11 06:48:55', 5, 1, 5, 1, 8, 1);
