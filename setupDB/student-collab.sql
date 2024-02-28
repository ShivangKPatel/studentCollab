-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               8.0.32 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for student-collab
CREATE DATABASE IF NOT EXISTS `student-collab` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `student-collab`;

-- Dumping structure for table student-collab.department
CREATE TABLE IF NOT EXISTS `department` (
  `DepartmentID` int NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`DepartmentID`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table student-collab.department: ~2 rows (approximately)
INSERT INTO `department` (`DepartmentID`, `name`) VALUES
	(1, 'Computer Engineering'),
	(2, 'Information Technology');

-- Dumping structure for table student-collab.project
CREATE TABLE IF NOT EXISTS `project` (
  `project_id` bigint NOT NULL AUTO_INCREMENT,
  `projectName` varchar(50) DEFAULT NULL,
  `projectDef` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `projectDesc` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `createDate` date DEFAULT NULL,
  `noOfStuReq` int NOT NULL DEFAULT '0',
  `noOfStuJoined` int NOT NULL DEFAULT '0',
  `requiredDep` varchar(50) NOT NULL DEFAULT '0',
  `stuReqByDep` int NOT NULL DEFAULT '0',
  `hostedBy` bigint NOT NULL DEFAULT '0',
  `projectLevel` int NOT NULL DEFAULT '0',
  `rating` int NOT NULL DEFAULT '0',
  `estTimeToComp` float NOT NULL DEFAULT '0',
  PRIMARY KEY (`project_id`),
  KEY `Project-student` (`hostedBy`),
  CONSTRAINT `Project-student` FOREIGN KEY (`hostedBy`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table student-collab.project: ~0 rows (approximately)

-- Dumping structure for table student-collab.rating
CREATE TABLE IF NOT EXISTS `rating` (
  `ratingVal` int NOT NULL,
  `Who` bigint NOT NULL,
  `Whom` bigint NOT NULL,
  KEY `FK_rating_student` (`Who`),
  KEY `FK_rating_student_2` (`Whom`),
  CONSTRAINT `FK_rating_student` FOREIGN KEY (`Who`) REFERENCES `student` (`student_id`),
  CONSTRAINT `FK_rating_student_2` FOREIGN KEY (`Whom`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table student-collab.rating: ~0 rows (approximately)

-- Dumping structure for table student-collab.student
CREATE TABLE IF NOT EXISTS `student` (
  `student_id` bigint NOT NULL AUTO_INCREMENT,
  `firstname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '',
  `lastname` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '',
  `username` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `password` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `email` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `phone_no` bigint DEFAULT '0',
  `departmentID` int NOT NULL,
  `Rating` float NOT NULL DEFAULT '-1',
  `NoOfRating` int NOT NULL DEFAULT '0',
  `no_project_done` int DEFAULT '0',
  `github` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '',
  `linkedin` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '',
  `resume` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '',
  `verified` int DEFAULT '0',
  PRIMARY KEY (`student_id`),
  KEY `FK_student_department` (`departmentID`) USING BTREE,
  CONSTRAINT `FK_student_department` FOREIGN KEY (`departmentID`) REFERENCES `department` (`DepartmentID`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='student table';

-- Dumping data for table student-collab.student: ~2 rows (approximately)
INSERT INTO `student` (`student_id`, `firstname`, `lastname`, `username`, `password`, `email`, `phone_no`, `departmentID`, `Rating`, `NoOfRating`, `no_project_done`, `github`, `linkedin`, `resume`, `verified`) VALUES
	(2, 'Shivang', 'Patel', 'Shivang_2005', 'NTkloxPjo2', 'shivang02052005@gmail.com', 6355703031, 1, 0, 0, 0, 'https://github.com/shivangkpatel/', 'https://www.linkedin.com/in/shivang-patel-36519a253', '', 1),
	(3, 'Het', 'Bhagatji', 'Het_2005', 'Bhagatji', 'hetbhagatji09@gmail.com', 123456789, 2, 0, 0, 0, 'https://github.com/hetbhagatji/', 'https://www.linkedin.com/in/hetbhagat', '', 1);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
