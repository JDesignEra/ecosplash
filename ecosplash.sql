-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 20, 2018 at 07:27 AM
-- Server version: 10.1.32-MariaDB
-- PHP Version: 7.2.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `ecosplash`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `random_select_task` ()  BEGIN
	TRUNCATE TABLE today_task;
    UPDATE users SET dailyTask = '00000';
	SET @i = 0;
    
	REPEAT
    	SET @i = @i + 1;
        SET @uid = (SELECT uid FROM daily_task ORDER BY RAND() LIMIT 1);
        SET @task = (SELECT task FROM daily_task WHERE uid = @uid);
        
        IF NOT EXISTS (SELECT * FROM today_task WHERE uid = @uid) THEN
            INSERT INTO today_task (uid, task) VALUES (@uid, @task);
        ELSE
        	SET @i = @i - 1;
        END IF;
	UNTIL @i > 4
    END REPEAT;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `daily_task`
--

CREATE TABLE `daily_task` (
  `uid` int(255) NOT NULL,
  `task` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `daily_task`
--

INSERT INTO `daily_task` (`uid`, `task`) VALUES
(1, 'Recycle plastics'),
(2, 'Leave your lights off during the day'),
(3, 'Do grocery with your own grocery bag'),
(4, 'Use public transport instead of driving to work'),
(5, 'Recycle old newspaper'),
(6, 'Participate in an environmental friendly event'),
(7, 'Finish all your meals without leaving any leftovers'),
(8, 'Do not litter in any public places');

-- --------------------------------------------------------

--
-- Table structure for table `event_history`
--

CREATE TABLE `event_history` (
  `eid` int(255) NOT NULL,
  `uid` int(255) NOT NULL,
  `joinDate` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `event` varchar(300) NOT NULL,
  `dateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `ecoPoints` int(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `event_history`
--

INSERT INTO `event_history` (`eid`, `uid`, `joinDate`, `event`, `dateTime`, `ecoPoints`, `status`) VALUES
(1, 1, '2018-06-17 05:59:06', 'Plant a Tree SG50', '2018-06-19 06:00:00', 100, 0),
(2, 1, '2018-06-17 05:59:09', 'Climate Action Carnival', '2018-06-18 05:00:00', 100, 1);

-- --------------------------------------------------------

--
-- Table structure for table `items`
--

CREATE TABLE `items` (
  `rid` int(255) NOT NULL,
  `item` varchar(1000) NOT NULL,
  `ecoPoints` int(255) NOT NULL,
  `weight` decimal(10,0) NOT NULL,
  `quantity` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `items`
--

INSERT INTO `items` (`rid`, `item`, `ecoPoints`, `weight`, `quantity`) VALUES
(1, 'Random', 300, '0', 0),
(2, 'Giant $100 Voucher', 1000, '10', 0),
(3, 'Giant $50 Voucher', 500, '50', 350),
(4, 'Giant $30 Voucher', 300, '70', 310),
(5, 'Giant $25 Voucher', 250, '75', 550);

-- --------------------------------------------------------

--
-- Table structure for table `redeemed_history`
--

CREATE TABLE `redeemed_history` (
  `oid` int(255) NOT NULL,
  `uid` int(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `items` text NOT NULL,
  `itemsQty` text NOT NULL,
  `itemsEcoPoints` text NOT NULL,
  `totalEcoPoints` int(255) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `redeemed_history`
--

INSERT INTO `redeemed_history` (`oid`, `uid`, `date`, `items`, `itemsQty`, `itemsEcoPoints`, `totalEcoPoints`) VALUES
(1, 1, '2018-06-16 16:00:00', 'Giant $50 Voucher,Giant $100 Voucher', '1,1', '50,100', 150),
(2, 1, '2018-06-16 16:00:00', 'Giant $30 Voucher,Giant $50 Voucher', '1,1', '30,50', 80),
(3, 1, '2018-06-16 16:00:00', 'Giant $50 Voucher,Giant $100 Voucher', '1,1', '50,100', 150),
(4, 1, '2018-06-16 16:00:00', 'Giant $30 Voucher,Giant $50 Voucher', '1,1', '30,50', 80),
(5, 1, '2018-06-16 16:00:00', 'Giant $50 Voucher,Giant $100 Voucher', '1,1', '50,100', 150),
(6, 1, '2018-06-16 16:00:00', 'Giant $30 Voucher,Giant $50 Voucher', '1,1', '30,50', 80),
(7, 1, '2018-06-15 16:00:00', 'Giant $50 Voucher,Giant $100 Voucher', '1,1', '50,100', 150),
(8, 1, '2018-06-16 16:00:00', 'Giant $30 Voucher,Giant $50 Voucher', '1,1', '30,50', 80),
(9, 1, '2018-06-16 16:00:00', 'Giant $50 Voucher,Giant $100 Voucher', '1,1', '50,100', 150),
(10, 1, '2018-06-16 16:00:00', 'Giant $30 Voucher,Giant $50 Voucher', '1,1', '30,50', 80),
(11, 1, '2018-06-16 16:00:00', 'Giant $30 Voucher,Giant $50 Voucher', '1,1', '30,50', 80);

-- --------------------------------------------------------

--
-- Table structure for table `today_task`
--

CREATE TABLE `today_task` (
  `uid` int(255) NOT NULL,
  `task` varchar(300) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `today_task`
--

INSERT INTO `today_task` (`uid`, `task`) VALUES
(1, 'Recycle plastics'),
(2, 'Leave your lights off during the day'),
(3, 'Do grocery with your own grocery bag'),
(4, 'Use public transport instead of driving to work'),
(5, 'Recycle old newspaper');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` int(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `bio` varchar(350) DEFAULT '',
  `type` tinyint(1) NOT NULL DEFAULT '0',
  `ecoPoints` int(255) NOT NULL DEFAULT '0',
  `newNotifications` int(255) NOT NULL DEFAULT '0',
  `dailyQuiz` tinyint(1) NOT NULL DEFAULT '0',
  `dailyTask` varchar(5) NOT NULL DEFAULT '00000',
  `fpCode` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `email`, `password`, `name`, `bio`, `type`, `ecoPoints`, `newNotifications`, `dailyQuiz`, `dailyTask`, `fpCode`) VALUES
(1, 'tgm.joel@gmail.com', '$2y$10$afw55Nbtd43DF8IrbLZ6euDusysvUPPnGB8ei.yu5Vb1PfHDTCt..', 'Joel', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.', 0, 31506, 0, 0, '00000', NULL),
(2, 'joel.jdesignera@gmail.com', '$2y$10$WXI2CtA7WaWeUufQwdWoWeFrtdfnfqxCHswd6czE5tCE4s4bDRcAy', 'JDesign', '', 1, 0, 0, 0, '00000', NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `daily_task`
--
ALTER TABLE `daily_task`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `event_history`
--
ALTER TABLE `event_history`
  ADD PRIMARY KEY (`eid`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`rid`);

--
-- Indexes for table `redeemed_history`
--
ALTER TABLE `redeemed_history`
  ADD PRIMARY KEY (`oid`);

--
-- Indexes for table `today_task`
--
ALTER TABLE `today_task`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`uid`) USING BTREE,
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `daily_task`
--
ALTER TABLE `daily_task`
  MODIFY `uid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `event_history`
--
ALTER TABLE `event_history`
  MODIFY `eid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `rid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `redeemed_history`
--
ALTER TABLE `redeemed_history`
  MODIFY `oid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `daily_quiz_reset` ON SCHEDULE EVERY 1 DAY STARTS '2018-06-01 00:00:00' ON COMPLETION PRESERVE ENABLE DO UPDATE users set dailyQuiz = 0$$

CREATE DEFINER=`root`@`localhost` EVENT `fpCode_reset` ON SCHEDULE EVERY 12 HOUR STARTS '2018-06-01 00:00:00' ON COMPLETION PRESERVE ENABLE DO UPDATE users set fpCode = NULL$$

CREATE DEFINER=`root`@`localhost` EVENT `daily_task_reset` ON SCHEDULE EVERY 1 DAY STARTS '2018-06-01 00:00:00' ON COMPLETION PRESERVE ENABLE DO CALL random_select_task()$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
