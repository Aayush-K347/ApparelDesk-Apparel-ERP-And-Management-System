-- MySQL dump 10.13  Distrib 8.0.39, for Win64 (x86_64)
--
-- Host: localhost    Database: appareldesk
-- ------------------------------------------------------
-- Server version	8.0.39

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_log`
--

DROP TABLE IF EXISTS `audit_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `audit_log` (
  `audit_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `table_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `record_id` bigint unsigned NOT NULL,
  `action_type` enum('INSERT','UPDATE','DELETE') COLLATE utf8mb4_unicode_ci NOT NULL,
  `old_values` json DEFAULT NULL,
  `new_values` json DEFAULT NULL,
  `changed_by` bigint unsigned DEFAULT NULL,
  `changed_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `ip_address` varchar(45) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `user_agent` text COLLATE utf8mb4_unicode_ci,
  PRIMARY KEY (`audit_id`),
  KEY `idx_table_record` (`table_name`,`record_id`),
  KEY `idx_changed_at` (`changed_at`),
  KEY `idx_changed_by` (`changed_by`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_log`
--

LOCK TABLES `audit_log` WRITE;
/*!40000 ALTER TABLE `audit_log` DISABLE KEYS */;
/*!40000 ALTER TABLE `audit_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group`
--

DROP TABLE IF EXISTS `auth_group`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(150) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group`
--

LOCK TABLES `auth_group` WRITE;
/*!40000 ALTER TABLE `auth_group` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_group_permissions`
--

DROP TABLE IF EXISTS `auth_group_permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_group_permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `group_id` int NOT NULL,
  `permission_id` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_group_permissions_group_id_permission_id_0cd325b0_uniq` (`group_id`,`permission_id`),
  KEY `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` (`permission_id`),
  CONSTRAINT `auth_group_permissio_permission_id_84c5c92e_fk_auth_perm` FOREIGN KEY (`permission_id`) REFERENCES `auth_permission` (`id`),
  CONSTRAINT `auth_group_permissions_group_id_b120cbf9_fk_auth_group_id` FOREIGN KEY (`group_id`) REFERENCES `auth_group` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_group_permissions`
--

LOCK TABLES `auth_group_permissions` WRITE;
/*!40000 ALTER TABLE `auth_group_permissions` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_group_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `auth_permission`
--

DROP TABLE IF EXISTS `auth_permission`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `auth_permission` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content_type_id` int NOT NULL,
  `codename` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `auth_permission_content_type_id_codename_01ab375a_uniq` (`content_type_id`,`codename`),
  CONSTRAINT `auth_permission_content_type_id_2f476e4b_fk_django_co` FOREIGN KEY (`content_type_id`) REFERENCES `django_content_type` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `auth_permission`
--

LOCK TABLES `auth_permission` WRITE;
/*!40000 ALTER TABLE `auth_permission` DISABLE KEYS */;
/*!40000 ALTER TABLE `auth_permission` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `contacts`
--

DROP TABLE IF EXISTS `contacts`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `contacts` (
  `contact_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `contact_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_type` enum('customer','vendor','both') COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address_line1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT 'India',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`contact_id`),
  KEY `idx_email` (`email`),
  KEY `idx_mobile` (`mobile`),
  KEY `idx_contact_type` (`contact_type`),
  KEY `idx_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `contacts`
--

LOCK TABLES `contacts` WRITE;
/*!40000 ALTER TABLE `contacts` DISABLE KEYS */;
/*!40000 ALTER TABLE `contacts` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `coupon_codes`
--

DROP TABLE IF EXISTS `coupon_codes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `coupon_codes` (
  `coupon_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `discount_offer_id` bigint unsigned NOT NULL,
  `coupon_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expiration_date` date NOT NULL,
  `coupon_status` enum('unused','used','expired') COLLATE utf8mb4_unicode_ci DEFAULT 'unused',
  `contact_id` bigint unsigned DEFAULT NULL,
  `usage_count` int DEFAULT '0',
  `max_usage_count` int DEFAULT '1',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `used_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`coupon_id`),
  UNIQUE KEY `coupon_code` (`coupon_code`),
  KEY `discount_offer_id` (`discount_offer_id`),
  KEY `idx_coupon_code` (`coupon_code`),
  KEY `idx_status` (`coupon_status`),
  KEY `idx_contact` (`contact_id`),
  KEY `idx_expiration` (`expiration_date`),
  CONSTRAINT `coupon_codes_ibfk_1` FOREIGN KEY (`discount_offer_id`) REFERENCES `discount_offers` (`discount_offer_id`) ON DELETE CASCADE,
  CONSTRAINT `coupon_codes_ibfk_2` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`contact_id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `coupon_codes`
--

LOCK TABLES `coupon_codes` WRITE;
/*!40000 ALTER TABLE `coupon_codes` DISABLE KEYS */;
/*!40000 ALTER TABLE `coupon_codes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer_invoices`
--

DROP TABLE IF EXISTS `customer_invoices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer_invoices` (
  `customer_invoice_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `invoice_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sales_order_id` bigint unsigned NOT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `payment_term_id` bigint unsigned NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date NOT NULL,
  `invoice_status` enum('draft','confirmed','partially_paid','paid','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `subtotal` decimal(15,2) DEFAULT '0.00',
  `discount_amount` decimal(15,2) DEFAULT '0.00',
  `tax_amount` decimal(15,2) DEFAULT '0.00',
  `total_amount` decimal(15,2) DEFAULT '0.00',
  `paid_amount` decimal(15,2) DEFAULT '0.00',
  `remaining_amount` decimal(15,2) GENERATED ALWAYS AS ((`total_amount` - `paid_amount`)) STORED,
  `early_payment_discount_applicable` tinyint(1) DEFAULT '0',
  `early_payment_discount_amount` decimal(15,2) DEFAULT '0.00',
  `early_payment_deadline` date DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`customer_invoice_id`),
  UNIQUE KEY `invoice_number` (`invoice_number`),
  KEY `payment_term_id` (`payment_term_id`),
  KEY `idx_invoice_number` (`invoice_number`),
  KEY `idx_customer` (`customer_id`),
  KEY `idx_sales_order` (`sales_order_id`),
  KEY `idx_status` (`invoice_status`),
  KEY `idx_dates` (`invoice_date`,`due_date`),
  CONSTRAINT `customer_invoices_ibfk_1` FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders` (`sales_order_id`) ON DELETE RESTRICT,
  CONSTRAINT `customer_invoices_ibfk_2` FOREIGN KEY (`customer_id`) REFERENCES `contacts` (`contact_id`) ON DELETE RESTRICT,
  CONSTRAINT `customer_invoices_ibfk_3` FOREIGN KEY (`payment_term_id`) REFERENCES `payment_terms` (`payment_term_id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_invoice_paid` CHECK (((`paid_amount` >= 0) and (`paid_amount` <= `total_amount`))),
  CONSTRAINT `chk_invoice_total` CHECK ((`total_amount` = ((`subtotal` - `discount_amount`) + `tax_amount`)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer_invoices`
--

LOCK TABLES `customer_invoices` WRITE;
/*!40000 ALTER TABLE `customer_invoices` DISABLE KEYS */;
/*!40000 ALTER TABLE `customer_invoices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `discount_offers`
--

DROP TABLE IF EXISTS `discount_offers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `discount_offers` (
  `discount_offer_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `offer_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `discount_percentage` decimal(5,2) NOT NULL,
  `start_date` date NOT NULL,
  `end_date` date NOT NULL,
  `available_on` enum('sales','website','both') COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`discount_offer_id`),
  KEY `idx_dates` (`start_date`,`end_date`),
  KEY `idx_available_on` (`available_on`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT `chk_offer_dates` CHECK ((`end_date` >= `start_date`)),
  CONSTRAINT `chk_offer_discount` CHECK ((`discount_percentage` between 0 and 100))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `discount_offers`
--

LOCK TABLES `discount_offers` WRITE;
/*!40000 ALTER TABLE `discount_offers` DISABLE KEYS */;
/*!40000 ALTER TABLE `discount_offers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_content_type`
--

DROP TABLE IF EXISTS `django_content_type`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_content_type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `app_label` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `model` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `django_content_type_app_label_model_76bd3d3b_uniq` (`app_label`,`model`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_content_type`
--

LOCK TABLES `django_content_type` WRITE;
/*!40000 ALTER TABLE `django_content_type` DISABLE KEYS */;
/*!40000 ALTER TABLE `django_content_type` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `django_migrations`
--

DROP TABLE IF EXISTS `django_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `django_migrations` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `app` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `applied` datetime(6) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `django_migrations`
--

LOCK TABLES `django_migrations` WRITE;
/*!40000 ALTER TABLE `django_migrations` DISABLE KEYS */;
INSERT INTO `django_migrations` VALUES (1,'contenttypes','0001_initial','2025-12-20 10:54:47.080552'),(2,'contenttypes','0002_remove_content_type_name','2025-12-20 10:54:47.144790'),(3,'auth','0001_initial','2025-12-20 10:54:47.375996'),(4,'auth','0002_alter_permission_name_max_length','2025-12-20 10:54:47.431017'),(5,'auth','0003_alter_user_email_max_length','2025-12-20 10:54:47.439026'),(6,'auth','0004_alter_user_username_opts','2025-12-20 10:54:47.446028'),(7,'auth','0005_alter_user_last_login_null','2025-12-20 10:54:47.453026'),(8,'auth','0006_require_contenttypes_0002','2025-12-20 10:54:47.456536'),(9,'auth','0007_alter_validators_add_error_messages','2025-12-20 10:54:47.464067'),(10,'auth','0008_alter_user_username_max_length','2025-12-20 10:54:47.470573'),(11,'auth','0009_alter_user_last_name_max_length','2025-12-20 10:54:47.482150'),(12,'auth','0010_alter_group_name_max_length','2025-12-20 10:54:47.501149'),(13,'auth','0011_update_proxy_permissions','2025-12-20 10:54:47.509158'),(14,'auth','0012_alter_user_first_name_max_length','2025-12-20 10:54:47.515156');
/*!40000 ALTER TABLE `django_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `document_sequences`
--

DROP TABLE IF EXISTS `document_sequences`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `document_sequences` (
  `sequence_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `document_type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prefix` varchar(20) COLLATE utf8mb4_unicode_ci NOT NULL,
  `next_number` bigint unsigned NOT NULL DEFAULT '1',
  `padding` int DEFAULT '6',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`sequence_id`),
  UNIQUE KEY `document_type` (`document_type`),
  KEY `idx_doc_type` (`document_type`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `document_sequences`
--

LOCK TABLES `document_sequences` WRITE;
/*!40000 ALTER TABLE `document_sequences` DISABLE KEYS */;
INSERT INTO `document_sequences` VALUES (1,'purchase_order','PO',1,6,'2025-12-20 10:29:27'),(2,'vendor_bill','BILL',1,6,'2025-12-20 10:29:27'),(3,'sales_order','SO',1,6,'2025-12-20 10:29:27'),(4,'customer_invoice','INV',1,6,'2025-12-20 10:29:27'),(5,'payment','PAY',1,6,'2025-12-20 10:29:27');
/*!40000 ALTER TABLE `document_sequences` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_allocations`
--

DROP TABLE IF EXISTS `payment_allocations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_allocations` (
  `allocation_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `payment_id` bigint unsigned NOT NULL,
  `customer_invoice_id` bigint unsigned DEFAULT NULL,
  `vendor_bill_id` bigint unsigned DEFAULT NULL,
  `allocated_amount` decimal(15,2) NOT NULL,
  `allocation_date` date NOT NULL,
  `early_payment_discount_applied` tinyint(1) DEFAULT '0',
  `discount_amount_applied` decimal(15,2) DEFAULT '0.00',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`allocation_id`),
  KEY `idx_payment` (`payment_id`),
  KEY `idx_invoice` (`customer_invoice_id`),
  KEY `idx_bill` (`vendor_bill_id`),
  CONSTRAINT `payment_allocations_ibfk_1` FOREIGN KEY (`payment_id`) REFERENCES `payments` (`payment_id`) ON DELETE CASCADE,
  CONSTRAINT `payment_allocations_ibfk_2` FOREIGN KEY (`customer_invoice_id`) REFERENCES `customer_invoices` (`customer_invoice_id`) ON DELETE CASCADE,
  CONSTRAINT `payment_allocations_ibfk_3` FOREIGN KEY (`vendor_bill_id`) REFERENCES `vendor_bills` (`vendor_bill_id`) ON DELETE CASCADE,
  CONSTRAINT `chk_allocation_amount` CHECK ((`allocated_amount` > 0)),
  CONSTRAINT `chk_allocation_target` CHECK ((((`customer_invoice_id` is not null) and (`vendor_bill_id` is null)) or ((`customer_invoice_id` is null) and (`vendor_bill_id` is not null))))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_allocations`
--

LOCK TABLES `payment_allocations` WRITE;
/*!40000 ALTER TABLE `payment_allocations` DISABLE KEYS */;
/*!40000 ALTER TABLE `payment_allocations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_terms`
--

DROP TABLE IF EXISTS `payment_terms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_terms` (
  `payment_term_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `term_name` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `net_days` int DEFAULT '0',
  `early_payment_discount` tinyint(1) DEFAULT '0',
  `discount_percentage` decimal(5,2) DEFAULT '0.00',
  `discount_days` int DEFAULT '0',
  `early_pay_discount_computation` enum('base_amount','total_amount') COLLATE utf8mb4_unicode_ci DEFAULT 'base_amount',
  `example_preview` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`payment_term_id`),
  UNIQUE KEY `term_name` (`term_name`),
  KEY `idx_term_name` (`term_name`),
  KEY `idx_active` (`is_active`),
  CONSTRAINT `chk_discount_days` CHECK ((`discount_days` >= 0)),
  CONSTRAINT `chk_discount_percentage` CHECK ((`discount_percentage` between 0 and 100)),
  CONSTRAINT `chk_net_days` CHECK ((`net_days` >= 0))
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_terms`
--

LOCK TABLES `payment_terms` WRITE;
/*!40000 ALTER TABLE `payment_terms` DISABLE KEYS */;
INSERT INTO `payment_terms` VALUES (1,'Immediate Payment',0,0,0.00,0,'base_amount','Payment Terms: Immediate Payment',1,'2025-12-20 10:29:27','2025-12-20 10:29:27'),(2,'Net 15',15,0,0.00,0,'base_amount','Payment Terms: Net 15 days',1,'2025-12-20 10:29:27','2025-12-20 10:29:27'),(3,'Net 30',30,0,0.00,0,'base_amount','Payment Terms: Net 30 days',1,'2025-12-20 10:29:27','2025-12-20 10:29:27'),(4,'Net 45',45,0,0.00,0,'base_amount','Payment Terms: Net 45 days',1,'2025-12-20 10:29:27','2025-12-20 10:29:27');
/*!40000 ALTER TABLE `payment_terms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payments`
--

DROP TABLE IF EXISTS `payments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payments` (
  `payment_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `payment_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_type` enum('customer_payment','vendor_payment') COLLATE utf8mb4_unicode_ci NOT NULL,
  `contact_id` bigint unsigned NOT NULL,
  `payment_date` date NOT NULL,
  `payment_method` enum('cash','credit_card','debit_card','bank_transfer','upi','wallet','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `payment_amount` decimal(15,2) NOT NULL,
  `payment_status` enum('pending','completed','failed','refunded') COLLATE utf8mb4_unicode_ci DEFAULT 'completed',
  `reference_number` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `transaction_id` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `payment_number` (`payment_number`),
  KEY `idx_payment_number` (`payment_number`),
  KEY `idx_contact` (`contact_id`),
  KEY `idx_type` (`payment_type`),
  KEY `idx_date` (`payment_date`),
  KEY `idx_status` (`payment_status`),
  CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`contact_id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_payment_amount` CHECK ((`payment_amount` > 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payments`
--

LOCK TABLES `payments` WRITE;
/*!40000 ALTER TABLE `payments` DISABLE KEYS */;
/*!40000 ALTER TABLE `payments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_colors`
--

DROP TABLE IF EXISTS `product_colors`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_colors` (
  `color_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `color_name` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `color_code` varchar(7) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  PRIMARY KEY (`color_id`),
  UNIQUE KEY `uk_product_color` (`product_id`,`color_name`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `product_colors_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_colors`
--

LOCK TABLES `product_colors` WRITE;
/*!40000 ALTER TABLE `product_colors` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_colors` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `product_images`
--

DROP TABLE IF EXISTS `product_images`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `product_images` (
  `image_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `image_url` varchar(500) COLLATE utf8mb4_unicode_ci NOT NULL,
  `image_alt_text` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `display_order` int DEFAULT '0',
  `is_primary` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`image_id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_primary` (`is_primary`),
  CONSTRAINT `product_images_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `product_images`
--

LOCK TABLES `product_images` WRITE;
/*!40000 ALTER TABLE `product_images` DISABLE KEYS */;
/*!40000 ALTER TABLE `product_images` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `product_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_category` enum('men','women','children','unisex') COLLATE utf8mb4_unicode_ci NOT NULL,
  `product_type` enum('shirt','pant','kurta','t-shirt','jeans','dress','other') COLLATE utf8mb4_unicode_ci NOT NULL,
  `material` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `description` text COLLATE utf8mb4_unicode_ci,
  `current_stock` decimal(15,3) DEFAULT '0.000',
  `minimum_stock` decimal(15,3) DEFAULT '0.000',
  `sales_price` decimal(15,2) NOT NULL,
  `sales_tax_percentage` decimal(5,2) DEFAULT '0.00',
  `purchase_price` decimal(15,2) NOT NULL,
  `purchase_tax_percentage` decimal(5,2) DEFAULT '0.00',
  `is_published` tinyint(1) DEFAULT '0',
  `is_active` tinyint(1) DEFAULT '1',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE KEY `product_code` (`product_code`),
  KEY `idx_product_code` (`product_code`),
  KEY `idx_category` (`product_category`),
  KEY `idx_type` (`product_type`),
  KEY `idx_published` (`is_published`),
  KEY `idx_active` (`is_active`),
  KEY `idx_stock` (`current_stock`),
  CONSTRAINT `chk_current_stock` CHECK ((`current_stock` >= 0)),
  CONSTRAINT `chk_purchase_price` CHECK ((`purchase_price` >= 0)),
  CONSTRAINT `chk_sales_price` CHECK ((`sales_price` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_order_lines`
--

DROP TABLE IF EXISTS `purchase_order_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_order_lines` (
  `po_line_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `purchase_order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `line_number` int NOT NULL,
  `quantity` decimal(15,3) NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `tax_percentage` decimal(5,2) DEFAULT '0.00',
  `line_subtotal` decimal(15,2) GENERATED ALWAYS AS ((`quantity` * `unit_price`)) STORED,
  `line_tax_amount` decimal(15,2) GENERATED ALWAYS AS ((((`quantity` * `unit_price`) * `tax_percentage`) / 100)) STORED,
  `line_total` decimal(15,2) GENERATED ALWAYS AS (((`quantity` * `unit_price`) * (1 + (`tax_percentage` / 100)))) STORED,
  `received_quantity` decimal(15,3) DEFAULT '0.000',
  PRIMARY KEY (`po_line_id`),
  UNIQUE KEY `uk_po_line` (`purchase_order_id`,`line_number`),
  KEY `idx_purchase_order` (`purchase_order_id`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `purchase_order_lines_ibfk_1` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`purchase_order_id`) ON DELETE CASCADE,
  CONSTRAINT `purchase_order_lines_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_po_quantity` CHECK ((`quantity` > 0)),
  CONSTRAINT `chk_po_received` CHECK (((`received_quantity` >= 0) and (`received_quantity` <= `quantity`))),
  CONSTRAINT `chk_po_unit_price` CHECK ((`unit_price` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_order_lines`
--

LOCK TABLES `purchase_order_lines` WRITE;
/*!40000 ALTER TABLE `purchase_order_lines` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_order_lines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_orders`
--

DROP TABLE IF EXISTS `purchase_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchase_orders` (
  `purchase_order_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `po_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `vendor_id` bigint unsigned NOT NULL,
  `order_date` date NOT NULL,
  `expected_delivery_date` date DEFAULT NULL,
  `po_status` enum('draft','confirmed','received','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `subtotal` decimal(15,2) DEFAULT '0.00',
  `tax_amount` decimal(15,2) DEFAULT '0.00',
  `total_amount` decimal(15,2) DEFAULT '0.00',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `confirmed_by` bigint unsigned DEFAULT NULL,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`purchase_order_id`),
  UNIQUE KEY `po_number` (`po_number`),
  KEY `idx_po_number` (`po_number`),
  KEY `idx_vendor` (`vendor_id`),
  KEY `idx_status` (`po_status`),
  KEY `idx_order_date` (`order_date`),
  CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`vendor_id`) REFERENCES `contacts` (`contact_id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_po_amounts` CHECK ((`total_amount` = (`subtotal` + `tax_amount`)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_orders`
--

LOCK TABLES `purchase_orders` WRITE;
/*!40000 ALTER TABLE `purchase_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `purchase_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_order_lines`
--

DROP TABLE IF EXISTS `sales_order_lines`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_order_lines` (
  `so_line_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `sales_order_id` bigint unsigned NOT NULL,
  `product_id` bigint unsigned NOT NULL,
  `line_number` int NOT NULL,
  `quantity` decimal(15,3) NOT NULL,
  `unit_price` decimal(15,2) NOT NULL,
  `tax_percentage` decimal(5,2) DEFAULT '0.00',
  `line_subtotal` decimal(15,2) GENERATED ALWAYS AS ((`quantity` * `unit_price`)) STORED,
  `line_tax_amount` decimal(15,2) GENERATED ALWAYS AS ((((`quantity` * `unit_price`) * `tax_percentage`) / 100)) STORED,
  `line_total` decimal(15,2) GENERATED ALWAYS AS (((`quantity` * `unit_price`) * (1 + (`tax_percentage` / 100)))) STORED,
  `invoiced_quantity` decimal(15,3) DEFAULT '0.000',
  PRIMARY KEY (`so_line_id`),
  UNIQUE KEY `uk_so_line` (`sales_order_id`,`line_number`),
  KEY `idx_sales_order` (`sales_order_id`),
  KEY `idx_product` (`product_id`),
  CONSTRAINT `sales_order_lines_ibfk_1` FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders` (`sales_order_id`) ON DELETE CASCADE,
  CONSTRAINT `sales_order_lines_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_so_invoiced` CHECK (((`invoiced_quantity` >= 0) and (`invoiced_quantity` <= `quantity`))),
  CONSTRAINT `chk_so_quantity` CHECK ((`quantity` > 0)),
  CONSTRAINT `chk_so_unit_price` CHECK ((`unit_price` >= 0))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_order_lines`
--

LOCK TABLES `sales_order_lines` WRITE;
/*!40000 ALTER TABLE `sales_order_lines` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_order_lines` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_orders`
--

DROP TABLE IF EXISTS `sales_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sales_orders` (
  `sales_order_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `so_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `customer_id` bigint unsigned NOT NULL,
  `payment_term_id` bigint unsigned NOT NULL,
  `order_date` date NOT NULL,
  `order_source` enum('backend','website') COLLATE utf8mb4_unicode_ci DEFAULT 'backend',
  `order_status` enum('draft','confirmed','invoiced','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `subtotal` decimal(15,2) DEFAULT '0.00',
  `discount_amount` decimal(15,2) DEFAULT '0.00',
  `tax_amount` decimal(15,2) DEFAULT '0.00',
  `total_amount` decimal(15,2) DEFAULT '0.00',
  `coupon_id` bigint unsigned DEFAULT NULL,
  `applied_discount_percentage` decimal(5,2) DEFAULT '0.00',
  `notes` text COLLATE utf8mb4_unicode_ci,
  `shipping_address_line1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_address_line2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `shipping_pincode` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  `confirmed_at` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`sales_order_id`),
  UNIQUE KEY `so_number` (`so_number`),
  KEY `payment_term_id` (`payment_term_id`),
  KEY `coupon_id` (`coupon_id`),
  KEY `idx_so_number` (`so_number`),
  KEY `idx_customer` (`customer_id`),
  KEY `idx_status` (`order_status`),
  KEY `idx_source` (`order_source`),
  KEY `idx_order_date` (`order_date`),
  CONSTRAINT `sales_orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `contacts` (`contact_id`) ON DELETE RESTRICT,
  CONSTRAINT `sales_orders_ibfk_2` FOREIGN KEY (`payment_term_id`) REFERENCES `payment_terms` (`payment_term_id`) ON DELETE RESTRICT,
  CONSTRAINT `sales_orders_ibfk_3` FOREIGN KEY (`coupon_id`) REFERENCES `coupon_codes` (`coupon_id`) ON DELETE SET NULL,
  CONSTRAINT `chk_so_discount` CHECK ((`discount_amount` >= 0)),
  CONSTRAINT `chk_so_total` CHECK ((`total_amount` = ((`subtotal` - `discount_amount`) + `tax_amount`)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_orders`
--

LOCK TABLES `sales_orders` WRITE;
/*!40000 ALTER TABLE `sales_orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `sales_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `stock_movements`
--

DROP TABLE IF EXISTS `stock_movements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `stock_movements` (
  `movement_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `product_id` bigint unsigned NOT NULL,
  `movement_type` enum('purchase','sale','adjustment','return') COLLATE utf8mb4_unicode_ci NOT NULL,
  `movement_date` date NOT NULL,
  `quantity` decimal(15,3) NOT NULL,
  `movement_direction` enum('in','out') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_type` enum('purchase_order','sales_order','adjustment') COLLATE utf8mb4_unicode_ci NOT NULL,
  `reference_id` bigint unsigned NOT NULL,
  `stock_before` decimal(15,3) NOT NULL,
  `stock_after` decimal(15,3) NOT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`movement_id`),
  KEY `idx_product` (`product_id`),
  KEY `idx_movement_date` (`movement_date`),
  KEY `idx_type` (`movement_type`),
  KEY `idx_reference` (`reference_type`,`reference_id`),
  CONSTRAINT `stock_movements_ibfk_1` FOREIGN KEY (`product_id`) REFERENCES `products` (`product_id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_quantity` CHECK ((`quantity` > 0)),
  CONSTRAINT `chk_stock_values` CHECK (((`stock_before` >= 0) and (`stock_after` >= 0)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `stock_movements`
--

LOCK TABLES `stock_movements` WRITE;
/*!40000 ALTER TABLE `stock_movements` DISABLE KEYS */;
/*!40000 ALTER TABLE `stock_movements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_settings`
--

DROP TABLE IF EXISTS `system_settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_settings` (
  `setting_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `setting_key` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `setting_value` text COLLATE utf8mb4_unicode_ci,
  `setting_type` enum('string','number','boolean','json') COLLATE utf8mb4_unicode_ci DEFAULT 'string',
  `description` text COLLATE utf8mb4_unicode_ci,
  `is_active` tinyint(1) DEFAULT '1',
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`setting_id`),
  UNIQUE KEY `setting_key` (`setting_key`),
  KEY `idx_key` (`setting_key`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_settings`
--

LOCK TABLES `system_settings` WRITE;
/*!40000 ALTER TABLE `system_settings` DISABLE KEYS */;
INSERT INTO `system_settings` VALUES (1,'automatic_invoicing','false','boolean','Automatically create customer invoice after website payment',1,'2025-12-20 10:29:27',NULL),(2,'tax_calculation_method','inclusive','string','Tax calculation method: inclusive or exclusive',1,'2025-12-20 10:29:27',NULL),(3,'default_currency','INR','string','Default currency code',1,'2025-12-20 10:29:27',NULL),(4,'stock_warning_threshold','10','number','Minimum stock level for warnings',1,'2025-12-20 10:29:27',NULL),(5,'session_timeout_minutes','30','number','User session timeout in minutes',1,'2025-12-20 10:29:27',NULL);
/*!40000 ALTER TABLE `system_settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `contact_id` bigint unsigned NOT NULL,
  `username` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_role` enum('internal','portal') COLLATE utf8mb4_unicode_ci NOT NULL,
  `mobile` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line1` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address_line2` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `state` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `pincode` varchar(10) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT '1',
  `last_login` timestamp NULL DEFAULT NULL,
  `failed_login_attempts` int DEFAULT '0',
  `account_locked_until` timestamp NULL DEFAULT NULL,
  `email_verified` tinyint(1) DEFAULT '0',
  `email_verification_token` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_reset_token` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `password_reset_expires` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`),
  KEY `idx_username` (`username`),
  KEY `idx_email` (`email`),
  KEY `idx_role` (`user_role`),
  KEY `idx_active` (`is_active`),
  KEY `idx_contact` (`contact_id`),
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`contact_id`) REFERENCES `contacts` (`contact_id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `vendor_bills`
--

DROP TABLE IF EXISTS `vendor_bills`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `vendor_bills` (
  `vendor_bill_id` bigint unsigned NOT NULL AUTO_INCREMENT,
  `bill_number` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `purchase_order_id` bigint unsigned NOT NULL,
  `vendor_id` bigint unsigned NOT NULL,
  `invoice_date` date NOT NULL,
  `due_date` date NOT NULL,
  `bill_status` enum('draft','confirmed','partially_paid','paid','cancelled') COLLATE utf8mb4_unicode_ci DEFAULT 'draft',
  `subtotal` decimal(15,2) DEFAULT '0.00',
  `tax_amount` decimal(15,2) DEFAULT '0.00',
  `total_amount` decimal(15,2) DEFAULT '0.00',
  `paid_amount` decimal(15,2) DEFAULT '0.00',
  `remaining_amount` decimal(15,2) GENERATED ALWAYS AS ((`total_amount` - `paid_amount`)) STORED,
  `vendor_reference` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `notes` text COLLATE utf8mb4_unicode_ci,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `created_by` bigint unsigned DEFAULT NULL,
  PRIMARY KEY (`vendor_bill_id`),
  UNIQUE KEY `bill_number` (`bill_number`),
  KEY `idx_bill_number` (`bill_number`),
  KEY `idx_vendor` (`vendor_id`),
  KEY `idx_purchase_order` (`purchase_order_id`),
  KEY `idx_status` (`bill_status`),
  KEY `idx_dates` (`invoice_date`,`due_date`),
  CONSTRAINT `vendor_bills_ibfk_1` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`purchase_order_id`) ON DELETE RESTRICT,
  CONSTRAINT `vendor_bills_ibfk_2` FOREIGN KEY (`vendor_id`) REFERENCES `contacts` (`contact_id`) ON DELETE RESTRICT,
  CONSTRAINT `chk_bill_amounts` CHECK ((`total_amount` = (`subtotal` + `tax_amount`))),
  CONSTRAINT `chk_bill_paid` CHECK (((`paid_amount` >= 0) and (`paid_amount` <= `total_amount`)))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `vendor_bills`
--

LOCK TABLES `vendor_bills` WRITE;
/*!40000 ALTER TABLE `vendor_bills` DISABLE KEYS */;
/*!40000 ALTER TABLE `vendor_bills` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-20 16:28:40
