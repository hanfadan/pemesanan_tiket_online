-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Jul 08, 2025 at 12:07 PM
-- Server version: 8.0.34
-- PHP Version: 8.1.16

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `farhanma_ticket`
--

-- --------------------------------------------------------

--
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `id` int UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `event_date` date NOT NULL,
  `description` text,
  `city` varchar(100) DEFAULT NULL,
  `venue` varchar(255) DEFAULT NULL,
  `address` text,
  `regular_price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `vip_price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `poster_url` varchar(255) DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`id`, `name`, `event_date`, `description`, `city`, `venue`, `address`, `regular_price`, `vip_price`, `poster_url`, `created_at`, `updated_at`) VALUES
(1, 'MENATA HATI MALANG SESI PAGI Malam siang', '2025-07-23', '<h2>\"BISA MEMAAFKAN BELUM BISA MELUPAKAN\"</h2><div><br></div><h2>🗓️ : Ahad, 13 Juli 2025</h2><h2>⏰ : Pukul 09.00 - 11.00 WIB</h2><h2>📍 : Harris Hotel and Conventions Malang</h2><div><br></div><h2>Jl. Riverside Blk. C No.1, Polowijen, Blimbing, Kota Malang</h2>', 'Malangs', 'Harris Hotel and Conventions Malangss', 'Jl. Riverside Blk. C No.1, Polowijen, Blimbing, Kota Malangs', 50000.00, 500000.00, '/uploads/poster-1751742382900.jpeg', '2025-07-05 13:53:26', '2025-07-07 02:17:02'),
(4, 'haah', '2025-07-17', 'ahahhahah', 'ahahhah', 'hahahah', 'ahhahah', 2123123.00, 9998888.00, '/uploads/poster-1751742406220.jpeg', '2025-07-05 19:06:46', '2025-07-05 19:06:46'),
(5, 'keren', '2025-07-08', '<div>\"BISA MEMAAFKAN BELUM BISA MELUPAKAN\"</div><div>🗓️ : Ahad, 13 Juli 2025</div><div>⏰ : Pukul 09.00 - 11.00 WIB</div><div>📍 : Harris Hotel and Conventions Malang</div><div>Jl. Riverside Blk. C No.1, Polowijen, Blimbing, Kota Malang</div>', 'sss', 'sss', 'sss', 100000.00, 300000.00, '/uploads/poster-1751742947823.jpeg', '2025-07-05 19:15:47', '2025-07-05 19:16:54'),
(6, 'geliss', '2025-07-03', 'geliss', 'geliss', 'geliss', 'geliss', 5000.00, 100000.00, '/uploads/poster-1751790047461.png', '2025-07-06 08:19:57', '2025-07-07 02:36:47');

-- --------------------------------------------------------

--
-- Table structure for table `event_sessions`
--

CREATE TABLE `event_sessions` (
  `id` int UNSIGNED NOT NULL,
  `event_id` int UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `start_time` datetime NOT NULL,
  `end_time` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- --------------------------------------------------------

--
-- Table structure for table `orders`
--

CREATE TABLE `orders` (
  `id` int UNSIGNED NOT NULL,
  `event_id` int UNSIGNED NOT NULL,
  `user_id` int UNSIGNED NOT NULL,
  `quantity` int NOT NULL,
  `total_price` decimal(12,2) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `ticket_type` enum('regular','vip') NOT NULL DEFAULT 'regular',
  `ticket_price` decimal(12,2) NOT NULL DEFAULT '0.00',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `orders`
--

INSERT INTO `orders` (`id`, `event_id`, `user_id`, `quantity`, `total_price`, `status`, `ticket_type`, `ticket_price`, `created_at`, `updated_at`) VALUES
(2, 1, 3, 1, 0.00, 'pending', 'vip', 0.00, '2025-07-05 17:55:31', '2025-07-05 17:55:31'),
(3, 4, 1, 1, 9998888.00, 'pending', 'vip', 9998888.00, '2025-07-05 21:00:28', '2025-07-05 21:00:28'),
(4, 4, 1, 1, 2123123.00, 'pending', 'regular', 2123123.00, '2025-07-05 21:01:21', '2025-07-05 21:01:21'),
(5, 1, 1, 1, 2000.00, 'pending', 'regular', 2000.00, '2025-07-05 21:02:55', '2025-07-05 21:02:55'),
(6, 1, 1, 1, 500000.00, 'pending', 'vip', 500000.00, '2025-07-05 21:03:22', '2025-07-05 21:03:22'),
(7, 4, 10, 1, 2123123.00, 'pending', 'regular', 2123123.00, '2025-07-05 22:00:10', '2025-07-05 22:00:10'),
(10, 1, 3, 1, 2000.00, 'pending', 'regular', 2000.00, '2025-07-06 08:17:19', '2025-07-06 08:17:19'),
(11, 1, 1, 2, 100000.00, 'pending', 'regular', 50000.00, '2025-07-07 02:33:01', '2025-07-07 02:33:01');

-- --------------------------------------------------------

--
-- Table structure for table `payments`
--

CREATE TABLE `payments` (
  `id` int UNSIGNED NOT NULL,
  `order_id` int UNSIGNED NOT NULL,
  `amount` decimal(12,2) NOT NULL,
  `method` varchar(50) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'pending',
  `qr_url` text,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ;

--
-- Dumping data for table `payments`
--

INSERT INTO `payments` (`id`, `order_id`, `amount`, `method`, `status`, `qr_url`, `created_at`, `updated_at`) VALUES
(1, 2, 0.00, 'qris', 'pending', '/api/qrcode?text=payment-1', '2025-07-05 17:58:14', '2025-07-05 17:58:14'),
(2, 2, 0.00, 'qris', 'pending', '/api/qrcode?text=payment-2', '2025-07-05 18:03:52', '2025-07-05 18:03:52'),
(3, 2, 0.00, 'qris', 'pending', '/uploads/payments/payment-3-1751748557946.png', '2025-07-05 20:49:17', '2025-07-05 20:49:17'),
(4, 3, 0.00, 'qris', 'pending', '/uploads/payments/payment-4-1751749228786.png', '2025-07-05 21:00:28', '2025-07-05 21:00:28'),
(5, 4, 0.00, 'qris', 'pending', '/uploads/payments/payment-5-1751749281160.png', '2025-07-05 21:01:21', '2025-07-05 21:01:21'),
(6, 5, 0.00, 'qris', 'pending', '/uploads/payments/payment-6-1751749375673.png', '2025-07-05 21:02:55', '2025-07-05 21:02:55'),
(7, 6, 0.00, 'qris', 'pending', '/uploads/payments/payment-7-1751749402512.png', '2025-07-05 21:03:22', '2025-07-05 21:03:22'),
(8, 7, 0.00, 'qris', 'pending', '/uploads/payments/payment-8-1751752810899.png', '2025-07-05 22:00:10', '2025-07-05 22:00:10'),
(11, 10, 0.00, 'qris', 'pending', '/uploads/payments/payment-11-1751789839987.png', '2025-07-06 08:17:19', '2025-07-06 08:17:19'),
(12, 11, 102500.00, 'qris', 'pending', '/uploads/payments/payment-12-1751855581925.png', '2025-07-07 02:33:01', '2025-07-07 02:33:01');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int UNSIGNED NOT NULL,
  `email` varchar(255) NOT NULL,
  `username` varchar(100) DEFAULT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `profile_url` varchar(255) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL DEFAULT 'user',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `email`, `username`, `phone`, `profile_url`, `password`, `name`, `role`, `created_at`, `updated_at`) VALUES
(1, 'alice@example.com', 're', 're', '/uploads/896d2159db71dfaf34b54d7148ce6377', '$2b$10$xuzSS7QH7/G.zlq9B86yGuqVLi./GnWD6El8i.sSIDR2ffrVyDYjC', 'res', 'admin', '2025-07-05 13:43:57', '2025-07-05 15:17:51'),
(2, 'alice@wonder.land', 'alice123', '08123456789', '/uploads/profile-1751729619470.png', '$2b$10$1tmBuxhTCeILevt/iEHfvuooyj5k1SMgkGb8Zw6yRuEV7fK1kR8xy', 'Alice Wonderland', 'user', '2025-07-05 14:13:40', '2025-07-05 15:33:39'),
(3, 'reus@yopmail.com', 'string', '123123123123', NULL, '$2b$10$uDESRdpLVNPkd6Xto3j6GeDuXN/6e6076CBmeIAhh.PCDWiooC2ry', 'reusmana', 'user', '2025-07-05 14:35:19', '2025-07-07 06:26:15'),
(5, 'hahah@yopmail.com', NULL, NULL, NULL, '$2b$10$YlJctTk8s388WIaOYkrV6eDPtbh0bgJf3WDXQ0U0qod.2JqRBdd..', 'hahah', 'user', '2025-07-05 14:35:53', '2025-07-05 14:35:53'),
(6, 'data@gmail.com', NULL, NULL, NULL, '$2b$10$dQsI5b4W7FQHdxCo3rNiGusKwG0.NtLH/7mGrvJGoOmAJWvnZyPw6', 'data', 'user', '2025-07-05 14:38:05', '2025-07-05 14:38:05'),
(7, 'dark@gmail.com', NULL, NULL, NULL, '$2b$10$S7N3NSVZs2bL98EO7OmSy.q6I066Y4LdrmujJnGpNxgO8JRm1rHFy', 'dark', 'user', '2025-07-05 14:39:45', '2025-07-05 14:39:45'),
(8, 'baru@yopmail.com', NULL, NULL, NULL, '$2b$10$SyTqsYv1VcREtsD8uWxNDOKSqZolCxMTxf1XfK.d2F830p3pkTzIy', 'barutut', 'user', '2025-07-05 15:35:50', '2025-07-05 21:58:36'),
(9, 'yoyo@gmail.com', NULL, NULL, NULL, '$2b$10$RFMtpPKzpvRgFrWThRN.LuB0PvKt1y9OrEHsMjDEVpw/xrk8yDB2q', 'string', 'user', '2025-07-05 15:47:51', '2025-07-07 02:43:23'),
(10, 'cools@unpak.ac.id', NULL, NULL, NULL, '$2b$10$yKAnqvR2mQeqfYW07/FnsupeVirmqlWSFO/SO3jPJJrzkuOcpVJTq', 'cools', 'user', '2025-07-05 21:59:09', '2025-07-07 02:43:25');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `event_sessions`
--
ALTER TABLE `event_sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_event` (`event_id`);

--
-- Indexes for table `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_order_event` (`event_id`),
  ADD KEY `idx_order_user` (`user_id`);

--
-- Indexes for table `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_payment_order` (`order_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `username` (`username`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `event_sessions`
--
ALTER TABLE `event_sessions`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `payments`
--
ALTER TABLE `payments`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `event_sessions`
--
ALTER TABLE `event_sessions`
  ADD CONSTRAINT `fk_session_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `fk_order_event` FOREIGN KEY (`event_id`) REFERENCES `events` (`id`) ON DELETE RESTRICT,
  ADD CONSTRAINT `fk_order_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT;

--
-- Constraints for table `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `fk_payment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
