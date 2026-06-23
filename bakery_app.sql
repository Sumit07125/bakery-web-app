CREATE DATABASE  IF NOT EXISTS `bakery_app` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `bakery_app`;
-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: bakery_app
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `admin`
--

DROP TABLE IF EXISTS `admin`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `admin` (
  `admin_id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `phone_no` bigint NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `admin`
--

LOCK TABLES `admin` WRITE;
/*!40000 ALTER TABLE `admin` DISABLE KEYS */;
/*!40000 ALTER TABLE `admin` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `bills`
--

DROP TABLE IF EXISTS `bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `bills` (
  `bill_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int DEFAULT NULL,
  `total_amount` decimal(10,2) DEFAULT NULL,
  `status` varchar(20) DEFAULT 'PENDING',
  `bill_date` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `p1` int DEFAULT NULL,
  `q1` int DEFAULT NULL,
  `p2` int DEFAULT NULL,
  `q2` int DEFAULT NULL,
  `p3` int DEFAULT NULL,
  `q3` int DEFAULT NULL,
  `order_status` varchar(40) DEFAULT 'Order Received',
  PRIMARY KEY (`bill_id`),
  KEY `user_id` (`user_id`),
  KEY `p1` (`p1`),
  KEY `p2` (`p2`),
  KEY `p3` (`p3`),
  CONSTRAINT `bills_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `bills_ibfk_2` FOREIGN KEY (`p1`) REFERENCES `products` (`product_id`) ON DELETE SET NULL,
  CONSTRAINT `bills_ibfk_3` FOREIGN KEY (`p2`) REFERENCES `products` (`product_id`) ON DELETE SET NULL,
  CONSTRAINT `bills_ibfk_4` FOREIGN KEY (`p3`) REFERENCES `products` (`product_id`) ON DELETE SET NULL
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `bills`
--

LOCK TABLES `bills` WRITE;
/*!40000 ALTER TABLE `bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `bills` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `cart`
--

DROP TABLE IF EXISTS `cart`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cart` (
  `cart_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `product_id` int NOT NULL,
  `quantity` int NOT NULL DEFAULT '1',
  PRIMARY KEY (`cart_id`),
  UNIQUE KEY `unique_user_product` (`user_id`,`product_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `cart_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `cart_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=56 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cart`
--

LOCK TABLES `cart` WRITE;
/*!40000 ALTER TABLE `cart` DISABLE KEYS */;
INSERT INTO `cart` VALUES (37,1,8,1);
/*!40000 ALTER TABLE `cart` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` int NOT NULL AUTO_INCREMENT,
  `product_name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `img_url` varchar(2555) NOT NULL,
  `description` text,
  `category` varchar(50) DEFAULT 'Other',
  PRIMARY KEY (`product_id`)
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'Mysore Pak',450.00,28,'https://img.freepik.com/premium-photo/mysore-pak-indian-sweet-prepared-ghee_521733-12165.jpg','A rich, sweet, and melt-in-the-mouth traditional Indian delicacy made with generous amounts of ghee, sugar, and gram flour.','Sweets'),(2,'Chocolate Cake',650.00,14,'https://th.bing.com/th/id/OIP.XfKQb1ZbxyccGXEcWQ_VPgHaHa?o=7&cb=12rm=3&rs=1&pid=ImgDetMain&o=7&rm=3','Decadent, moist chocolate cake layered with rich fudge frosting. Perfect for any celebration or a midnight craving.','Cakes'),(3,'Red Velvet Cupcake',120.00,40,'https://th.bing.com/th/id/OIP.GQTeiAV6zwOUSApmkyw6ngHaEK?o=7&cb=12rm=3&rs=1&pid=ImgDetMain&o=7&rm=3','Classic moist red velvet cake topped with a generous swirl of tangy and sweet cream cheese frosting.','Cakes'),(4,'Black Forest Pastry',90.00,48,'https://www.ruchiskitchen.com/wp-content/uploads/2021/05/Eggless-Black-forest-pastry-02-1-683x1024.jpg','Traditional German dessert featuring layers of chocolate sponge cake, whipped cream, and luscious cherries.','Cakes'),(5,'Pineapple Pastry',85.00,43,'https://tse1.mm.bing.net/th/id/OIP.BwEYpj6Tpf7zJGLrdfPo1AHaJQ?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3','Light and refreshing sponge cake layered with fresh pineapple chunks and smooth vanilla cream.','Cakes'),(6,'Butter Cookies',250.00,60,'https://img.freepik.com/free-photo/butter-cookies_1339-1743.jpg','Classic, crumbly cookies made with premium butter that simply melt in your mouth. Perfect with tea or coffee.','Cookies'),(7,'Rasgulla',350.00,35,'https://th.bing.com/th/id/OIP.ibmTOU1t-Zl1LKlZUOAewgHaHa?o=7&cb=12rm=3&rs=1&pid=ImgDetMain&o=7&rm=3','Soft, spongy, and juicy milk-solid balls soaked in a delicate sugar syrup infused with rose water.','Sweets'),(8,'Kaju Katli',600.00,25,'https://th.bing.com/th/id/OIP.d9OfVEfRsMxbvNYzOmiLLQHaE-?o=7&cb=12rm=3&rs=1&pid=ImgDetMain&o=7&rm=3','A premium Indian sweet made from cashew nuts, sugar, and ghee, garnished with edible silver foil.','Sweets'),(9,'Baklava',700.00,18,'https://tse2.mm.bing.net/th/id/OIP.kFlIVDFW3aBxfcsX5jYV-QHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3','Rich, sweet pastry made of layers of filo dough filled with chopped nuts and sweetened with syrup or honey.','Sweets'),(10,'Doughnut',70.00,51,'https://tse4.mm.bing.net/th/id/OIP._MHjT_o_pe3ClSbSS6Te_AHaEo?cb=12&w=1920&h=1200&rs=1&pid=ImgDetMain&o=7&rm=3','Freshly fried, pillowy soft doughnut glazed with a smooth and glossy sugary coating.','Pastries'),(11,'Croissant',90.00,39,'https://tse2.mm.bing.net/th/id/OIP.viZx5oefVmeeam9tdJDzbQHaG6?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3','Authentic French-style pastry featuring flaky, buttery layers with a beautifully crisp exterior and soft interior.','Pastries'),(12,'Fruit Tart',300.00,22,'https://images.squarespace-cdn.com/content/v1/533f584fe4b0f77e1bd2e4d1/1624992895865-BEP5PAI4R7PYBQU9T0TW/summer.fruit.tart.1_butteryum.jpg','A crisp buttery tart shell filled with rich custard and topped with a colorful array of fresh seasonal fruits.','Pastries'),(13,'Cheese Cake',550.00,16,'https://tse2.mm.bing.net/th/id/OIP.7s4_AWNCD-sRn4BmTu3V_AHaHa?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3','Creamy, smooth New York style cheesecake with a buttery graham cracker crust and a hint of vanilla.','Cakes'),(14,'Banana Bread',200.00,20,'https://tse3.mm.bing.net/th/id/OIP.JnSG7aGGyv5dHHfYkyVoDgHaLH?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3','Moist, sweet bread loaded with ripe bananas and a touch of cinnamon, baked to golden perfection.','Breads'),(15,'Plum Cake',450.00,29,'https://tse4.mm.bing.net/th/id/OIP.fdJSO7a8pXARFJqqJT1xigHaFj?cb=12&rs=1&pid=ImgDetMain&o=7&rm=3','Traditional rich fruit cake loaded with rum-soaked dry fruits and warm spices. A holiday classic!','Cakes'),(17,'Barfi',300.00,40,'https://th.bing.com/th/id/OIP.oBH2GJL3ax5j06EUlbUBfgHaE8?w=263&h=180&c=7&r=0&o=7&dpr=2&pid=1.7&rm=3',NULL,'Other');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `review_id` int NOT NULL AUTO_INCREMENT,
  `product_id` int NOT NULL,
  `user_id` int NOT NULL,
  `rating` tinyint NOT NULL,
  `review_text` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`review_id`),
  KEY `product_id` (`product_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `reviews_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE CASCADE,
  CONSTRAINT `reviews_chk_1` CHECK ((`rating` between 1 and 5))
) ENGINE=InnoDB AUTO_INCREMENT=18 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (1,1,1,5,'One of the best I have ever had! - Priya M.','2026-06-23 06:18:27'),(2,2,1,4,'Worth every penny! - Neha D.','2026-06-23 06:18:27'),(3,3,1,5,'Perfect sweetness and great texture. - Pooja V.','2026-06-23 06:18:27'),(4,4,1,5,'Absolutely delicious! Highly recommended. - Priya M.','2026-06-23 06:18:27'),(5,5,1,5,'Perfect sweetness and great texture. - Priya M.','2026-06-23 06:18:27'),(6,6,1,5,'Perfect sweetness and great texture. - Rahul S.','2026-06-23 06:18:27'),(7,7,1,5,'Simply amazing, my family loved it. - Rohit S.','2026-06-23 06:18:27'),(8,8,1,5,'Simply amazing, my family loved it. - Rohit S.','2026-06-23 06:18:27'),(9,9,1,5,'Worth every penny! - Amit K.','2026-06-23 06:18:27'),(10,10,1,4,'Perfect sweetness and great texture. - Priya M.','2026-06-23 06:18:27'),(11,11,1,4,'Worth every penny! - Rohit S.','2026-06-23 06:18:27'),(12,12,1,5,'Good quality and fast delivery. - Amit K.','2026-06-23 06:18:27'),(13,13,1,5,'Absolutely delicious! Highly recommended. - Rahul S.','2026-06-23 06:18:27'),(14,14,1,5,'Perfect sweetness and great texture. - Vikas R.','2026-06-23 06:18:27'),(15,15,1,5,'The taste is authentic and premium. - Rahul S.','2026-06-23 06:18:27'),(16,17,1,4,'Absolutely delicious! Highly recommended. - Karan T.','2026-06-23 06:18:27'),(17,4,2,4,'fasdfasdf','2026-06-23 06:19:05');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `teacher`
--

DROP TABLE IF EXISTS `teacher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `teacher` (
  `id` int NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `subject` varchar(20) DEFAULT NULL,
  `salary` int DEFAULT NULL,
  `city` varchar(20) DEFAULT 'Dhule',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `teacher`
--

LOCK TABLES `teacher` WRITE;
/*!40000 ALTER TABLE `teacher` DISABLE KEYS */;
/*!40000 ALTER TABLE `teacher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `address` varchar(2555) NOT NULL,
  `age` int NOT NULL,
  `phone_number` varchar(20) NOT NULL,
  `email` varchar(255) NOT NULL,
  `passward` varchar(255) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-23 13:14:04
