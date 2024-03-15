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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table student-collab.department: ~2 rows (approximately)
INSERT INTO `department` (`DepartmentID`, `name`) VALUES
	(1, 'Computer Engineering'),
	(2, 'Information Technology'),
	(3, 'no');

-- Dumping structure for table student-collab.project
CREATE TABLE IF NOT EXISTS `project` (
  `project_id` bigint NOT NULL AUTO_INCREMENT,
  `projectName` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `projectDef` varchar(500) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `projectDesc` varchar(1000) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `createDate` date NOT NULL,
  `noOfStuReq` int NOT NULL DEFAULT '0',
  `noOfStuJoined` int DEFAULT '0',
  `requiredDep` varchar(50) NOT NULL DEFAULT '0',
  `stuReqByDep` int DEFAULT '0',
  `hostedBy` bigint NOT NULL DEFAULT '0',
  `projectLevel` int NOT NULL DEFAULT '0',
  `rating` int DEFAULT '0',
  `estTimeToComp` int NOT NULL DEFAULT '0',
  PRIMARY KEY (`project_id`),
  KEY `Project-student` (`hostedBy`),
  CONSTRAINT `Project-student` FOREIGN KEY (`hostedBy`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table student-collab.project: ~0 rows (approximately)
INSERT INTO `project` (`project_id`, `projectName`, `projectDef`, `projectDesc`, `createDate`, `noOfStuReq`, `noOfStuJoined`, `requiredDep`, `stuReqByDep`, `hostedBy`, `projectLevel`, `rating`, `estTimeToComp`) VALUES
	(1, 'ABC', 'Student Collabratioon', 'It is a new project hsoted by shivang patel', '2024-03-14', 4, 0, 'Computer Engineering, Mechanical Engineering', 0, 2, 2, 0, 150),
	(3, 'PQR', 'Student Collabratioon', 'It is a new project hsoted by shivang patel', '2024-03-14', 4, 0, 'Computer Engineering, Mechanical Engineering', 0, 4, 2, 0, 150),
	(4, ' XYZ ', ' Group Project ', ' A project that requires collaboration between 2 students, hosted by a mentor with ID 3.', '2024-03-14', 2, 0, ' Computer Science, Electrical Engineering ', 0, 3, 2, 0, 100),
	(7, ' LMN ', ' Individual Project ', ' An advanced project for students with expertise in AI and Machine Learning, hosted by a mentor with ID 4.', '2024-03-14', 1, 0, ' Artificial Intelligence, Machine Learning ', 0, 4, 3, 0, 200),
	(8, ' XYZ  ', ' Individual Project  ', ' A challenging project in Deep Learning and Natural Language Processing, hosted by a mentor with ID 3.', '2024-03-14', 1, 0, ' Deep Learning, Natural Language Processing  ', 0, 3, 3, 0, 180),
	(9, ' ABC  ', ' Group Project (Max 2 students)  ', ' A research-oriented project on Computer Vision and Robotics, led by a mentor with ID 4. This project is suitable for a group of two students.', '2024-03-14', 2, 0, ' Computer Vision, Robotics  ', 0, 4, 2, 0, 120),
	(10, ' PQR  ', ' Individual Project  ', ' A beginner-friendly project to learn Programming Fundamentals, mentored by someone with ID 2.', '2024-03-14', 1, 0, ' Programming Fundamentals  ', 0, 2, 1, 0, 60),
	(11, ' DEF  ', ' Individual Project  ', ' An intermediate project on Data Structures and Algorithms, hosted by a mentor with ID 3.', '2024-03-14', 1, 0, ' Data Structures, Algorithms  ', 0, 3, 2, 0, 100),
	(12, ' MNO  ', ' Group Project (Max 3 students)  ', ' An advanced project on High Performance Computing and Parallel Programming, requiring a team of up to 3 students. This project is led by a mentor with ID 4.', '2024-03-14', 3, 0, ' High Performance Computing, Parallel Programming ', 0, 4, 4, 0, 250),
	(13, ' GHI  ', ' Individual Project  ', ' A creative project on User Interface Design and Web Development, suitable for a beginner and mentored by someone with ID 2.', '2024-03-14', 1, 0, ' User Interface Design, Web Development  ', 0, 2, 1, 0, 80),
	(14, ' JKL  ', ' Group Project (Max 4 students)  ', ' An application development project requiring knowledge of Software Engineering and Full Stack Development. This project is suitable for a group of up to 4 students and will be guided by a mentor with ID 3.', '2024-03-14', 4, 0, ' Software Engineering, Full Stack Development  ', 0, 3, 3, 0, 220),
	(15, ' TUV  ', ' Individual Project  ', ' A theoretical project on Complexity Theory and Cryptography, suitable for an advanced student with expertise in these areas. This project is led by a mentor with ID 4.', '2024-03-14', 1, 0, ' Complexity Theory, Cryptography  ', 0, 4, 4, 0, 280),
	(16, ' WXY  ', ' Individual Project  ', ' A data analysis project requiring knowledge of Statistics and Data Visualization, mentored by someone with ID 2.', '2024-03-14', 1, 0, ' Statistics, Data Visualization  ', 0, 2, 2, 0, 150);

-- Dumping structure for table student-collab.rating
CREATE TABLE IF NOT EXISTS `rating` (
  `ratingVal` int NOT NULL,
  `Who` bigint NOT NULL,
  `Whom` bigint NOT NULL,
  `Cat` int NOT NULL DEFAULT '0',
  KEY `FK_rating_student` (`Who`),
  KEY `FK_rating_student_2` (`Whom`),
  CONSTRAINT `FK_rating_student` FOREIGN KEY (`Who`) REFERENCES `student` (`student_id`),
  CONSTRAINT `FK_rating_student_2` FOREIGN KEY (`Whom`) REFERENCES `student` (`student_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Dumping data for table student-collab.rating: ~2 rows (approximately)
INSERT INTO `rating` (`ratingVal`, `Who`, `Whom`, `Cat`) VALUES
	(4, 2, 3, 0),
	(5, 3, 2, 0);

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
  `Rating` float NOT NULL DEFAULT '0',
  `NoOfRating` int NOT NULL DEFAULT '0',
  `no_project_done` int DEFAULT '0',
  `github` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '',
  `linkedin` varchar(200) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '',
  `resume` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT '',
  `verified` int DEFAULT '0',
  PRIMARY KEY (`student_id`),
  KEY `FK_student_department` (`departmentID`) USING BTREE,
  CONSTRAINT `FK_student_department` FOREIGN KEY (`departmentID`) REFERENCES `department` (`DepartmentID`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci COMMENT='student table';

-- Dumping data for table student-collab.student: ~3 rows (approximately)
INSERT INTO `student` (`student_id`, `firstname`, `lastname`, `username`, `password`, `email`, `phone_no`, `departmentID`, `Rating`, `NoOfRating`, `no_project_done`, `github`, `linkedin`, `resume`, `verified`) VALUES
	(2, 'Shivang', 'Patel', 'Shivang_2005', 'NTkloxPjo2', 'shivang02052005@gmail.com', 6355703031, 1, 5, 0, 0, 'https://github.com/shivangkpatel/', 'https://www.linkedin.com/in/shivang-patel-36519a253', './uploads/resume/2.pdf', 1),
	(3, 'Het', 'Bhagatji', 'Het_2005', 'Bhagatji', 'hetbhagatji09@gmail.com', 123456789, 2, 4, 0, 0, 'https://github.com/hetbhagatji/', 'https://www.linkedin.com/in/hetbhagat', '', 1),
	(4, 'Shivam', 'Patel', 'Raj_Shah_2004', 'Raj Shah', 'rajveershah7111@gmail.com', 123456789, 2, 0, 0, 0, '', '', './uploads/resume/4.pdf', 0);

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
