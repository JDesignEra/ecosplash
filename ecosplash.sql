-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 16, 2018 at 01:23 PM
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
  `task` text NOT NULL
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
-- Table structure for table `redeemed_history`
--

CREATE TABLE `redeemed_history` (
  `uid` int(255) NOT NULL,
  `date` date NOT NULL,
  `item` text NOT NULL,
  `itemEcoPoints` text NOT NULL,
  `totalEcoPoints` int(255) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `today_task`
--

CREATE TABLE `today_task` (
  `uid` int(255) NOT NULL,
  `task` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `today_task`
--

INSERT INTO `today_task` (`uid`, `task`) VALUES
(2, 'Leave your lights off during the day'),
(3, 'Do grocery with your own grocery bag'),
(4, 'Use public transport instead of driving to work'),
(5, 'Recycle old newspaper'),
(6, 'Participate in an environmental friendly event');

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
  `ecoPoints` int(11) NOT NULL DEFAULT '0',
  `newNotifications` int(11) NOT NULL DEFAULT '0',
  `dailyQuiz` tinyint(1) NOT NULL DEFAULT '0',
  `dailyTask` varchar(5) NOT NULL DEFAULT '00000',
  `fpCode` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `email`, `password`, `name`, `bio`, `type`, `ecoPoints`, `newNotifications`, `dailyQuiz`, `dailyTask`, `fpCode`) VALUES
(1, 'tgm.joel@gmail.com', '$2y$10$O0jPfIT2dL091dUpbiattetvJRXnGUmT0B0DHk17wdvHTMDXGpyaO', 'Joel', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.', 0, 31504, 0, 0, '10010', 'YcqAyHEw'),
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
-- Indexes for table `redeemed_history`
--
ALTER TABLE `redeemed_history`
  ADD PRIMARY KEY (`uid`);

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
-- AUTO_INCREMENT for table `redeemed_history`
--
ALTER TABLE `redeemed_history`
  MODIFY `uid` int(255) NOT NULL AUTO_INCREMENT;

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
