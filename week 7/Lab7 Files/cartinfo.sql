-- phpMyAdmin SQL Dump
-- version 4.9.7
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Feb 21, 2022 at 08:46 AM
-- Server version: 5.6.41-84.1
-- PHP Version: 7.3.32

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `jcarman1_php`
--

-- --------------------------------------------------------

--
-- Table structure for table `cartinfo`
--

CREATE TABLE `cartinfo` (
  `dbcartid` int(11) NOT NULL,
  `dbcartemp` int(11) NOT NULL,
  `dbcartcust` int(11) NOT NULL,
  `dbcartdate` datetime NOT NULL,
  `dbcartdailyid` int(11) NOT NULL,
  `dbcartpickup` int(11) NOT NULL,
  `dbcartmade` int(11) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `cartinfo`
--

INSERT INTO `cartinfo` (`dbcartid`, `dbcartemp`, `dbcartcust`, `dbcartdate`, `dbcartdailyid`, `dbcartpickup`, `dbcartmade`) VALUES
(54, 22, 23, '2022-02-16 08:34:37', 2, 0, 0),
(53, 19, 23, '2022-02-16 08:33:08', 1, 0, 0);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cartinfo`
--
ALTER TABLE `cartinfo`
  ADD PRIMARY KEY (`dbcartid`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `cartinfo`
--
ALTER TABLE `cartinfo`
  MODIFY `dbcartid` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=55;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
