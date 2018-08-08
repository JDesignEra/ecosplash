-- phpMyAdmin SQL Dump
-- version 4.8.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Aug 08, 2018 at 08:45 AM
-- Server version: 10.1.33-MariaDB
-- PHP Version: 7.2.6

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
CREATE DEFINER=`root`@`localhost` PROCEDURE `random_select_daily_quiz` ()  MODIFIES SQL DATA
BEGIN
	UPDATE quizzes SET todayQuiz = 0;
	UPDATE users set dailyQuiz = 0;
	UPDATE quizzes SET todayQuiz = 1 ORDER BY RAND() LIMIT 1;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `random_select_task` ()  MODIFIES SQL DATA
BEGIN
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
  `postal` varchar(6) NOT NULL,
  `ecoPoints` int(255) NOT NULL DEFAULT '100',
  `redeemCode` varchar(6) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `events`
--

INSERT INTO `events` (`eid`, `uid`, `dateTime`, `event`, `location`, `postal`, `ecoPoints`, `redeemCode`) VALUES
(7, 7, '2018-08-09 16:00:00', 'Recycling Day', 'Suntec City', '038983', 100, 'euIT'),
(8, 7, '2018-08-14 09:47:09', 'Tree Planting', 'Tiong Bahru Garden', '168898', 100, 'B3NI'),
(9, 7, '2018-08-14 09:47:46', 'Earth Day Gathering', 'Outside Nanyang Polytechnic', '569830', 100, 'wbsj'),
(10, 7, '2018-08-16 09:48:23', 'Clean and Green Seminar', 'Marina Bay Sands', '018956', 100, 'tTRE'),
(11, 7, '2018-08-18 09:50:04', 'Food Waste Reduction Awareness Campaign', 'Orchard Central', '238858', 100, 'tyj9'),
(12, 7, '2018-08-29 13:00:00', 'Save Water Awareness Campaign', 'Expo', '486150', 100, 'FyQu'),
(13, 7, '2018-09-29 16:00:00', 'Climate Change Seminar', 'Jurong West', '610112', 100, 'KCRW'),
(14, 7, '2018-11-09 07:00:00', 'Green Talks', 'National University Of Singapore(NUS)', '119077', 100, 'rhxU'),
(17, 7, '2018-12-21 05:00:00', 'Global Warming Campaign', 'Suntec City', '038983', 100, 'ZDnj');

-- --------------------------------------------------------

--
-- Table structure for table `events_attendance`
--

CREATE TABLE `events_attendance` (
  `eid` int(255) NOT NULL,
  `uid` int(255) NOT NULL,
  `uids` text,
  `statuses` text
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `events_attendance`
--

INSERT INTO `events_attendance` (`eid`, `uid`, `uids`, `statuses`) VALUES
(7, 0, '1,4', '0'),
(8, 0, '1', '0'),
(9, 0, NULL, NULL),
(10, 0, NULL, NULL),
(11, 0, NULL, NULL),
(12, 0, NULL, NULL),
(13, 0, NULL, NULL),
(14, 0, '4', '0'),
(15, 0, NULL, NULL),
(16, 0, NULL, NULL),
(17, 0, NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `event_history`
--

CREATE TABLE `event_history` (
  `eid` int(255) NOT NULL,
  `uid` int(255) NOT NULL,
  `event` varchar(300) NOT NULL,
  `dateTime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `location` text NOT NULL,
  `postal` varchar(6) NOT NULL,
  `ecoPoints` int(255) NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `event_history`
--

INSERT INTO `event_history` (`eid`, `uid`, `event`, `dateTime`, `location`, `postal`, `ecoPoints`, `status`) VALUES
(1, 1, 'Recycling Day', '2018-08-09 16:00:00', 'Suntec City', '038983', 100, 0),
(2, 1, 'Tree Planting', '2018-08-14 09:47:09', 'Tiong Bahru Garden', '168898', 100, 0),
(3, 4, 'Recycling Day', '2018-08-09 16:00:00', 'Suntec City', '038983', 100, 0),
(4, 4, 'Green Talks', '2018-11-09 07:00:00', 'National University Of Singapore(NUS)', '119077', 100, 0);

-- --------------------------------------------------------

--
-- Table structure for table `friends`
--

CREATE TABLE `friends` (
  `fid` int(255) NOT NULL,
  `uid_one` int(255) NOT NULL,
  `uid_two` int(255) NOT NULL,
  `status` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

--
-- Dumping data for table `friends`
--

INSERT INTO `friends` (`fid`, `uid_one`, `uid_two`, `status`) VALUES
(16, 3, 1, 1),
(17, 10, 4, 0),
(18, 10, 8, 0),
(19, 10, 9, 0),
(20, 3, 6, 0),
(21, 3, 7, 1),
(23, 11, 4, 0),
(24, 12, 11, 1),
(25, 10, 13, 1);

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
(2, 'Giant $50 Voucher', 500, '50', 329),
(3, 'Giant $30 Voucher', 300, '70', 289),
(4, 'Giant $25 Voucher', 250, '75', 534),
(5, 'FairPrice $100 Voucher', 1000, '10', 0),
(6, 'FairPrice $50 Voucher', 500, '50', 328),
(7, 'FairPrice $30 Voucher', 300, '70', 293),
(8, 'FairPrice $25 Voucher', 250, '75', 532);

-- --------------------------------------------------------

--
-- Table structure for table `notifications`
--

CREATE TABLE `notifications` (
  `nid` int(255) NOT NULL,
  `uid` int(255) NOT NULL,
  `message` text NOT NULL,
  `nType` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `notifications`
--

INSERT INTO `notifications` (`nid`, `uid`, `message`, `nType`) VALUES
(1, 3, '<span class=\"text-secondary font-weight-bold\">Joel</span> joined <span class=\"text-secondary font-weight-bold\">Recycling Day</span> on <span class=\"text-secondary font-weight-bold\">10/08/2018</span> at <span class=\"text-secondary font-weight-bold\">12:00 am</span> located at <span class=\"text-secondary font-weight-bold\">Suntec City</span>', 5),
(2, 3, '<span class=\"text-secondary font-weight-bold\">Joel</span> joined <span class=\"text-secondary font-weight-bold\">Tree Planting</span> on <span class=\"text-secondary font-weight-bold\">14/08/2018</span> at <span class=\"text-secondary font-weight-bold\">05:47 pm</span> located at <span class=\"text-secondary font-weight-bold\">Tiong Bahru Garden</span>', 5),
(4, 3, '<span class=\"text-secondary font-weight-bold\">Zyon Wee</span> reject your follow request.', 3),
(6, 10, '<span class=\"text-secondary font-weight-bold\">America Got Trees</span> accepted your follow request.', 2),
(7, 10, '<span class=\"text-secondary font-weight-bold\">Arman Khan</span> joined <span class=\"text-secondary font-weight-bold\">Recycling Day</span> on <span class=\"text-secondary font-weight-bold\">10/08/2018</span> at <span class=\"text-secondary font-weight-bold\">12:00 am</span> located at <span class=\"text-secondary font-weight-bold\">Suntec City</span>', 5),
(8, 10, '<span class=\"text-secondary font-weight-bold\">Arman Khan</span> joined <span class=\"text-secondary font-weight-bold\">Green Talks</span> on <span class=\"text-secondary font-weight-bold\">09/11/2018</span> at <span class=\"text-secondary font-weight-bold\">03:00 pm</span> located at <span class=\"text-secondary font-weight-bold\">National University Of Singapore(NUS)</span>', 5);

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
(2, 13, '2018-08-04 13:46:30', 'Does America Have Trees?', 'How many trees are there in America?|How many species of trees are there in the world?|Trees reproduce by...', 'As many as there is in Singapore (2 million)|1 000 Trees|288 Billion Trees|1 Tree|60|600|6, 000|60, 000|Giving Birth|Laying Eggs|Dropping Nests|Seeds', '2,3,3', 6, 1),
(3, 13, '2018-08-05 05:06:11', 'Trees In The World', 'Trees are..|Trees absorb..', 'Rocks|Stones|Toys|Living things|Rocks|Stones|Living things|Light', '3,3', 4, 0);

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
(1, 3, '2018-08-04 09:46:04', 'FairPrice $50 Voucher', '1', '500', 500),
(2, 3, '2018-08-04 09:46:27', 'FairPrice $25 Voucher', '2', '250', 500),
(3, 1, '2018-08-04 22:10:03', 'FairPrice $50 Voucher,Giant $30 Voucher,Giant $50 Voucher', '1,2,1', '500,300,500', 1600),
(4, 1, '2018-08-04 22:10:14', 'Giant $30 Voucher', '1', '300', 300),
(5, 1, '2018-08-05 20:11:57', 'Giant $30 Voucher', '1', '300', 300);

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
(2, 'Leave your lights off during the day'),
(3, 'Do grocery with your own grocery bag'),
(5, 'Recycle old newspaper'),
(6, 'Participate in an environmental friendly event'),
(8, 'Do not litter in any public places');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `uid` int(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` longtext NOT NULL,
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
(1, 'tgm.joel@gmail.com', '$2y$10$pMfTcINZhmLYXTJLIh1qZ.9Zm4gP0heJ5k9FjhaGiDCUZBS44MWLW', 'Joel', 'A freelance full-stack developer/designer, and have been in the world of freelancing since 2012.\r\nHave a deep passion for UI/UX designs and programming languages.', 0, 27957, 0, 0, '00000', 31507, NULL),
(2, 'joel.jdesignera@gmail.com', '$2y$10$yTCMCMMltYTR6K9IkrmgPu.E4lP2uW26XFiaI5iUNT.Zu/QBmGveO', 'JDesign', 'A new era of design', 1, 0, 0, 0, '00000', 0, NULL),
(3, 'yk2796@gmail.com', '$2y$10$u7FlyeBCQI7B9AdPxJ3sYuol8ylCJyI9IcjZJeYH0L8MXaXNFRIxO', 'Yong Kai', 'In nature nothing exists alone.', 0, 840, 0, 0, '00000', 1840, NULL),
(4, 'arman154khan@gmail.com', '$2y$10$d88lzfQN68GLXIaEHA/Gee..rXY8aA/8Vs5Ki7RsCYVIPXz.WZrPu', 'Arman Khan', 'A Polytechnic that wants to be Clean and Green wherever possible!', 0, 2685, 0, 0, '00000', 2685, NULL),
(6, 'lim.wilson97@gmail.com', '$2y$10$twZ0WIoB41UNqA/b1jPGse3Plp0KVLaQcQ5fUgk0lTjkJC31khYI2', 'Wilson Lim', '', 0, 1230, 0, 0, '00000', 1230, NULL),
(7, '182558z@mymail.nyp.edu.sg', '$2y$10$2b20OUwu8B3Fi18jYhpS5e04NpKVp7FVjGPC2tJmotKj666c5Roz6', 'Arman Khan Organization', 'And Organization bent on helping the world go Green!', 1, 0, 0, 0, '00000', 0, NULL),
(8, 'arman_khan@chr.edu.sg', '$2y$10$Y0h5niPNsHdF1Dsiosbra.9YqxhGoYVyvy7BCiKnC1wXw0F318Jdi', 'James Loo', 'Looking to make friends and have fun while doing what I love', 1, 0, 0, 0, '00000', 0, NULL),
(9, 'kkakik1598@gmail.com', '$2y$10$Lh3o9KEg2DhA9WPYXPhH9emfyK69JUUNz8M0OYj.7JS5EIrc8Y1T.', 'Josh Lee', 'ðŸŒ¿â™¥ï¸ Loves the environment! â™¥ï¸ðŸŒ¿', 1, 0, 0, 0, '00000', 0, NULL),
(10, 'zyonwee@gmail.com', '$2y$10$XLPT2BtR9TkMWckr3I2lyuUq/3XGaxi8B2BTIQ9R3EQ5v9aVmv49W', 'Zyon Wee', 'Hai ! :D I WANNA CATCH ALL ECO POINTS!! AND BE THE VERY BEST :3', 0, 1661, 0, 1, '11111', 1661, NULL),
(11, 'ryantan1@gmail.com', '$2y$10$X547ECysvUEK3lgBrvIrNOo2pCn3g39baR.1O8WEyVAub2zakikju', 'Ryan Tan', '', 0, 1480, 0, 0, '00000', 1480, NULL),
(12, 'ryantan2@gmail.com', '$2y$10$t0a8Z5IbcbkSHXYY00eYrugwdsoSoQB/i/nE8lEjlJS9oY9yZQ9e6', 'Rihen Wong', 'I really love Mother Nature! I hope to keep our environment clean and healthy! Side note I have curly hair XD', 0, 1340, 0, 0, '00000', 1340, NULL),
(13, '180440s@mymail.nyp.edu.sg', '$2y$10$E6BI.1vGnuY7.Nrq04yyNegw6VqjgHVrC.LRcJdArv/QEtICtNdei', 'America Got Trees', 'America got trees! Blaze them up and down and CHANGE THE WORLD!', 1, 0, 0, 0, '00000', 0, NULL),
(24, 'Jane@gmail.com', '$2y$10$5Ly3hzPKQVeqrdOY9dSGrOfqBv12gYdwT2m1mu09QLENhVHJ/Sujq', 'Jane', '', 0, 0, 0, 0, '00000', 0, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `utilities`
--

CREATE TABLE `utilities` (
  `euid` int(255) NOT NULL,
  `uid` int(255) NOT NULL,
  `useAmounts` text NOT NULL,
  `prices` text NOT NULL,
  `type` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf32;

--
-- Dumping data for table `utilities`
--

INSERT INTO `utilities` (`euid`, `uid`, `useAmounts`, `prices`, `type`) VALUES
(1, 1, '300,480,600,150,200,350,250,350,200,327,255,300', '$4.28,$113.52,$600,$150,$200,$350,$200,$350,$200,$327,$255,$300', 'electric'),
(2, 1, '300,400,600,150,200,350,250,350,200,327,255,300', '$4.28,$5.74,$600,$150,$200,$350,$200,$350,$200,$327,$255,$300', 'water'),
(3, 11, '500,400,450,375,500,800,900,0,0,0,0,0', '$118.25,$94.6,$106.43,$88.69,$118.25,$189.2,$212.85,$0,$0,$0,$0,$0', 'electric'),
(4, 11, '500,500,650,440,300,600,320,0,0,0,0,0', '$7.2,$7.2,$9.39,$6.32,$4.28,$8.66,$4.57,$0,$0,$0,$0,$0', 'water'),
(5, 11, '400,300,220,180,280,300,100,0,0,0,0,0', '$74.12,$55.59,$40.77,$33.35,$51.88,$55.59,$18.53,$0,$0,$0,$0,$0', 'gas'),
(6, 12, '150,180,50,80,125,60,120,0,0,0,0,0', '$35.48,$42.57,$11.83,$18.92,$29.56,$14.19,$28.38,$0,$0,$0,$0,$0', 'electric'),
(7, 12, '800,1099,1200,777,670,990,760,0,0,0,0,0', '$11.58,$15.94,$17.42,$11.24,$9.68,$14.35,$10.99,$0,$0,$0,$0,$0', 'water'),
(8, 12, '400,256,300,244,180,300,250,0,0,0,0,0', '$74.12,$47.44,$55.59,$45.21,$33.35,$55.59,$46.33,$0,$0,$0,$0,$0', 'gas'),
(9, 4, '300,200,0,0,0,0,0,600,267,0,0,0', '$70.95,$47.3,$0,$0,$0,$0,$0,$141.9,$63.15,$0,$0,$0', 'electric');

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
-- Indexes for table `events_attendance`
--
ALTER TABLE `events_attendance`
  ADD PRIMARY KEY (`eid`);

--
-- Indexes for table `event_history`
--
ALTER TABLE `event_history`
  ADD PRIMARY KEY (`eid`);

--
-- Indexes for table `friends`
--
ALTER TABLE `friends`
  ADD PRIMARY KEY (`fid`);

--
-- Indexes for table `items`
--
ALTER TABLE `items`
  ADD PRIMARY KEY (`rid`);

--
-- Indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`nid`);

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
-- Indexes for table `utilities`
--
ALTER TABLE `utilities`
  ADD PRIMARY KEY (`euid`);

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
  MODIFY `eid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT for table `event_history`
--
ALTER TABLE `event_history`
  MODIFY `eid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `friends`
--
ALTER TABLE `friends`
  MODIFY `fid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `items`
--
ALTER TABLE `items`
  MODIFY `rid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `nid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `quizzes`
--
ALTER TABLE `quizzes`
  MODIFY `qid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `redeemed_history`
--
ALTER TABLE `redeemed_history`
  MODIFY `oid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `uid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `utilities`
--
ALTER TABLE `utilities`
  MODIFY `euid` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

DELIMITER $$
--
-- Events
--
CREATE DEFINER=`'root'`@`'localhost'` EVENT `daily_task_reset` ON SCHEDULE EVERY 1 DAY STARTS '2018-06-01 00:15:00' ON COMPLETION PRESERVE ENABLE DO CALL random_select_task()$$

CREATE DEFINER=`'root'`@`'localhost'` EVENT `fpCode_reset` ON SCHEDULE EVERY 12 HOUR STARTS '2018-06-01 00:05:00' ON COMPLETION PRESERVE ENABLE DO UPDATE users set fpCode = NULL$$

CREATE DEFINER=`'root'`@`'localhost'` EVENT `yearly_bill_resets` ON SCHEDULE EVERY 1 YEAR STARTS '2018-01-01 00:10:00' ON COMPLETION PRESERVE ENABLE DO TRUNCATE TABLE utilities$$

CREATE DEFINER=`'root'`@`'localhost'` EVENT `daily_quiz_reset` ON SCHEDULE EVERY 1 DAY STARTS '2018-06-01 00:00:00' ON COMPLETION PRESERVE ENABLE DO CALL random_select_daily_quiz()$$

DELIMITER ;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
