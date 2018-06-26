-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 26, 2018 at 08:17 PM
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `random_select_daily_quiz` ()  BEGIN
	UPDATE quizzes SET todayQuiz = 0;
	UPDATE users set dailyQuiz = 0;
	UPDATE quizzes SET todayQuiz = 1 ORDER BY RAND() LIMIT 1;
END$$

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
-- Table structure for table `events`
--

CREATE TABLE `events` (
  `eid` int(255) NOT NULL,
  `uid` int(255) NOT NULL,
  `dateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `event` text NOT NULL,
  `location` text NOT NULL,
  `ecoPoints` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`eid`, `uid`, `dateTime`, `event`, `location`, `ecoPoints`) VALUES
(1, 2, '2018-08-05 06:06:22', 'Clean & Green Singapore 2018', 'Suntec', 100),
(2, 2, '2018-08-05 06:06:26', 'Food Waste Reduction Roadshow', 'Orchard', 100),
(3, 2, '2018-10-15 06:06:31', 'Green Living 2018', 'Expo', 100),
(4, 2, '2017-03-09 05:10:00', 'Green Living 2015', 'Expo', 100);

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
(1, 'Giant $100 Voucher', 1000, '10', 0),
(2, 'Giant $50 Voucher', 500, '50', 339),
(3, 'Giant $30 Voucher', 300, '70', 300),
(4, 'Giant $25 Voucher', 250, '75', 543);

-- --------------------------------------------------------

--
-- Table structure for table `quizzes`
--

CREATE TABLE `quizzes` (
  `qid` int(255) NOT NULL,
  `uid` int(255) NOT NULL,
  `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `name` varchar(255) NOT NULL,
  `questions` longtext NOT NULL,
  `options` longtext NOT NULL,
  `answers` text NOT NULL,
  `ecoPoints` int(255) NOT NULL,
  `todayQuiz` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `quizzes`
--

INSERT INTO `quizzes` (`qid`, `uid`, `date`, `name`, `questions`, `options`, `answers`, `ecoPoints`, `todayQuiz`) VALUES
(1, 2, '2018-06-24 07:52:07', 'How much do you know about the world around you?', 'About how long does it take a Styrofoam cup to decompose?|What is the most common type of trash thrown away by Americans?|Three Mile Island was the site of what disaster?|What country consumes the most energy in the world?|How much of the world\'s water is available for human use?|What is the most common type of debris that litters our oceans?|According to the World Health Organization, what is the most polluted city in the world?|Which of the following sources of energy is NOT renewable?|Which country produces the most energy in the world?|What is the leading source of energy in the United States?', '10 years|2 months|400 years|150 years|Paper products and cardboard|Metals|Glass|Plastics|The worst nuclear explosion in the world|The worst forest fires in US history|The worst accident in US nuclear reactor history|The worst oil spill in US history|Russia|China|United States|Canada|97%|23%|3%|Less than 1%|Bags|Plastic beverage bottles|Cigarettes|Food packaging|Los Angeles, California|Mexico City, Mexico|New Dehali, India|Shanghai, China|Petroleum|Hydro-power|Biomass|Solar power|Iraq|China|United States|Russia|Coal|Oil|Nuclear power|Natural gas', '2,1,1,2,3,1,0,0,1,1', 20, 0),
(2, 2, '2018-06-24 07:52:07', 'How much do you know about the world around you?', 'About how long does it take a Styrofoam cup to decompose?|What is the most common type of trash thrown away by Americans?|Three Mile Island was the site of what disaster?|What country consumes the most energy in the world?|How much of the world\'s water is available for human use?|What is the most common type of debris that litters our oceans?|According to the World Health Organization, what is the most polluted city in the world?|Which of the following sources of energy is NOT renewable?|Which country produces the most energy in the world?|What is the leading source of energy in the United States?', '10 years|2 months|400 years|150 years|Paper products and cardboard|Metals|Glass|Plastics|The worst nuclear explosion in the world|The worst forest fires in US history|The worst accident in US nuclear reactor history|The worst oil spill in US history|Russia|China|United States|Canada|97%|23%|3%|Less than 1%|Bags|Plastic beverage bottles|Cigarettes|Food packaging|Los Angeles, California|Mexico City, Mexico|New Dehali, India|Shanghai, China|Petroleum|Hydro-power|Biomass|Solar power|Iraq|China|United States|Russia|Coal|Oil|Nuclear power|Natural gas', '2,1,1,2,3,1,0,0,1,1', 20, 0),
(3, 2, '2018-06-24 07:52:07', 'How much do you know about the world around you?', 'About how long does it take a Styrofoam cup to decompose?|What is the most common type of trash thrown away by Americans?|Three Mile Island was the site of what disaster?|What country consumes the most energy in the world?|How much of the world\'s water is available for human use?|What is the most common type of debris that litters our oceans?|According to the World Health Organization, what is the most polluted city in the world?|Which of the following sources of energy is NOT renewable?|Which country produces the most energy in the world?|What is the leading source of energy in the United States?', '10 years|2 months|400 years|150 years|Paper products and cardboard|Metals|Glass|Plastics|The worst nuclear explosion in the world|The worst forest fires in US history|The worst accident in US nuclear reactor history|The worst oil spill in US history|Russia|China|United States|Canada|97%|23%|3%|Less than 1%|Bags|Plastic beverage bottles|Cigarettes|Food packaging|Los Angeles, California|Mexico City, Mexico|New Dehali, India|Shanghai, China|Petroleum|Hydro-power|Biomass|Solar power|Iraq|China|United States|Russia|Coal|Oil|Nuclear power|Natural gas', '2,1,1,2,3,1,0,0,1,1', 20, 0),
(4, 2, '2018-06-24 07:52:07', 'How much do you know about the world around you?', 'About how long does it take a Styrofoam cup to decompose?|What is the most common type of trash thrown away by Americans?|Three Mile Island was the site of what disaster?|What country consumes the most energy in the world?|How much of the world\'s water is available for human use?|What is the most common type of debris that litters our oceans?|According to the World Health Organization, what is the most polluted city in the world?|Which of the following sources of energy is NOT renewable?|Which country produces the most energy in the world?|What is the leading source of energy in the United States?', '10 years|2 months|400 years|150 years|Paper products and cardboard|Metals|Glass|Plastics|The worst nuclear explosion in the world|The worst forest fires in US history|The worst accident in US nuclear reactor history|The worst oil spill in US history|Russia|China|United States|Canada|97%|23%|3%|Less than 1%|Bags|Plastic beverage bottles|Cigarettes|Food packaging|Los Angeles, California|Mexico City, Mexico|New Dehali, India|Shanghai, China|Petroleum|Hydro-power|Biomass|Solar power|Iraq|China|United States|Russia|Coal|Oil|Nuclear power|Natural gas', '2,1,1,2,3,1,0,0,1,1', 20, 0),
(5, 2, '2018-06-24 07:52:07', 'How much do you know about the world around you?', 'About how long does it take a Styrofoam cup to decompose?|What is the most common type of trash thrown away by Americans?|Three Mile Island was the site of what disaster?|What country consumes the most energy in the world?|How much of the world\'s water is available for human use?|What is the most common type of debris that litters our oceans?|According to the World Health Organization, what is the most polluted city in the world?|Which of the following sources of energy is NOT renewable?|Which country produces the most energy in the world?|What is the leading source of energy in the United States?', '10 years|2 months|400 years|150 years|Paper products and cardboard|Metals|Glass|Plastics|The worst nuclear explosion in the world|The worst forest fires in US history|The worst accident in US nuclear reactor history|The worst oil spill in US history|Russia|China|United States|Canada|97%|23%|3%|Less than 1%|Bags|Plastic beverage bottles|Cigarettes|Food packaging|Los Angeles, California|Mexico City, Mexico|New Dehali, India|Shanghai, China|Petroleum|Hydro-power|Biomass|Solar power|Iraq|China|United States|Russia|Coal|Oil|Nuclear power|Natural gas', '2,1,1,2,3,1,0,0,1,1', 20, 1);

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
(1, 1, '2018-06-22 16:16:24', 'Giant $50 Voucher', '1', '500', 500),
(2, 1, '2018-06-22 16:16:48', 'Giant $30 Voucher,Giant $50 Voucher', '2,1', '300,500', 1100),
(3, 1, '2018-06-22 16:17:29', 'Giant $25 Voucher', '1', '250', 250),
(4, 1, '2018-06-22 16:21:40', 'Giant $25 Voucher', '2', '250', 500),
(5, 1, '2018-06-22 16:48:44', 'Giant $30 Voucher,Giant $50 Voucher', '1,1', '300,500', 800),
(6, 1, '2018-06-22 16:59:18', 'Giant $30 Voucher,Giant $50 Voucher', '1,1', '300,500', 800),
(7, 1, '2018-06-22 16:59:41', 'Giant $30 Voucher,Giant $50 Voucher', '1,1', '300,500', 800),
(8, 1, '2018-06-22 17:27:59', 'Giant $30 Voucher,Giant $50 Voucher', '1,1', '300,500', 800),
(9, 1, '2018-06-22 17:31:19', 'Giant $30 Voucher,Giant $50 Voucher', '2,1', '300,500', 1100),
(10, 1, '2018-06-22 17:37:32', 'Giant $30 Voucher,Giant $50 Voucher', '1,1', '300,500', 800),
(11, 1, '2018-06-22 17:41:39', 'Giant $30 Voucher,Giant $50 Voucher', '1,1', '300,500', 800),
(12, 1, '2018-06-22 17:43:10', 'Giant $50 Voucher', '2', '500', 1000),
(13, 1, '2018-06-22 17:43:42', 'Giant $25 Voucher', '1', '250', 250),
(14, 1, '2018-06-22 17:44:05', 'Giant $25 Voucher', '1', '250', 250);

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
(5, 'Recycle old newspaper'),
(6, 'Participate in an environmental friendly event'),
(7, 'Finish all your meals without leaving any leftovers'),
(8, 'Do not litter in any public places');

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
  `ecoPointsMonth` int(255) NOT NULL DEFAULT '0',
  `fpCode` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`uid`, `email`, `password`, `name`, `bio`, `type`, `ecoPoints`, `newNotifications`, `dailyQuiz`, `dailyTask`, `ecoPointsMonth`, `fpCode`) VALUES
(1, 'tgm.joel@gmail.com', '$2y$10$afw55Nbtd43DF8IrbLZ6euDusysvUPPnGB8ei.yu5Vb1PfHDTCt..', 'Joel', 'Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor. Aenean massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec quam felis, ultricies nec, pellentesque eu, pretium quis, sem. Nulla consequat massa quis enim. Donec.', 0, 23606, 0, 0, '00000', 30105, NULL),
(2, 'joel.jdesignera@gmail.com', '$2y$10$WXI2CtA7WaWeUufQwdWoWeFrtdfnfqxCHswd6czE5tCE4s4bDRcAy', 'JDesign', '', 1, 0, 0, 0, '00000', 0, NULL);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `daily_task`
--
ALTER TABLE `daily_task`
  ADD PRIMARY KEY (`uid`);

--
-- Indexes for table `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`eid`);

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
-- Indexes for table `quizzes`
--
ALTER TABLE `quizzes`
  ADD PRIMARY KEY (`qid`);

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
-- AUTO_INCREMENT for table `events`
--
ALTER TABLE `events`
  MODIFY `eid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `event_history`
--
ALTER TABLE `event_history`
  MODIFY `eid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `rid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `qid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `redeemed_history`
--
ALTER TABLE `redeemed_history`
  MODIFY `oid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`root`@`localhost` EVENT `daily_task_reset` ON SCHEDULE EVERY 1 DAY STARTS '2018-06-01 00:00:00' ON COMPLETION PRESERVE ENABLE DO CALL random_select_task()$$

CREATE DEFINER=`root`@`localhost` EVENT `fpCode_reset` ON SCHEDULE EVERY 12 HOUR STARTS '2018-06-01 00:00:00' ON COMPLETION PRESERVE ENABLE DO UPDATE users set fpCode = NULL$$

CREATE DEFINER=`root`@`localhost` EVENT `daily_quiz_reset` ON SCHEDULE EVERY 1 DAY STARTS '2018-06-01 00:00:00' ON COMPLETION PRESERVE ENABLE DO CALL random_select_daily_quiz()$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
