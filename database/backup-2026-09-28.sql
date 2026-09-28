-- MySQL dump 10.13  Distrib 8.4.3, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: boac_accomplishment_hub
-- ------------------------------------------------------
-- Server version	8.4.3

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
-- Table structure for table `accomplishment_items`
--

DROP TABLE IF EXISTS `accomplishment_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `accomplishment_items` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entry_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `position_index` int NOT NULL,
  `content` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_item_position` (`entry_id`,`position_index`),
  CONSTRAINT `fk_accomplishment_items_entry` FOREIGN KEY (`entry_id`) REFERENCES `report_entries` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `accomplishment_items`
--

LOCK TABLES `accomplishment_items` WRITE;
/*!40000 ALTER TABLE `accomplishment_items` DISABLE KEYS */;
INSERT INTO `accomplishment_items` VALUES ('01691d46-63bd-4bc0-986a-8eaff0742e01','3d4790c2-5dfc-4e0b-a787-9d4e7f5a20cd',0,'Edited tax declaration EDMS at ICTS Office (2020 Book 69)'),('01993b58-b27f-4493-a447-1da301fea68f','eeb613ad-894f-4964-b06c-05944a296153',0,'Photo and Video Documentation of the \"126th Civil Service Month - 2 Day League (Basketball, Volleyball, Pickleball) - Day 2\"'),('10c7d017-91e2-416e-9081-80f82e043c97','7a359620-bba6-41ed-9f4c-aa8171c0ca23',2,'Troubleshtoot laptop at Mayor\'s Office'),('11168ff6-dbc0-4897-967c-005e81a3c532','93db53b2-aa66-42f6-8d6a-2aa533ffe6b0',2,'Speedtest at Mun. Slaughter House'),('13603984-8929-4dd0-9d02-13321f4e5f21','e071a4bb-e2a0-47fb-aeae-883b36a4d339',0,'Scanned and uploaded Tax Declaration 2020 Book 65 at IT  Office'),('136dcdb1-9db5-4e39-87a0-08b8fed05423','54300f54-206b-40fa-a695-ebf239fc48be',2,'Check TP-Link Switch of DICT Free Wifi at Control Room of Casa Real'),('1c196867-bb24-4218-a295-8c9cee34d67b','93db53b2-aa66-42f6-8d6a-2aa533ffe6b0',0,'Assist Students for Wiring UTP Cable and Termination using RJ45 at Mun. Slaughter House'),('1e4f81a2-ae47-45c5-80a9-6ccc7d3ec6b9','d6ff3e4e-e817-4783-ba36-89f366680a5a',3,'Troubleshoot Laptop Computer at Mayor\'s Office (Activate Microsoft Word Office)'),('2111fa5f-dd8e-44ec-bc14-d79b698cebff','9e7ff415-9b67-4deb-961e-33f806069eda',1,'Troubleshoot EPSON L5290 at Accounting Office'),('217af1b9-2a37-4af0-871d-2a172fb934da','e44f5aa1-9b9d-48e0-8f69-b579bf59a775',0,'Scanned and Uploaded Tax Declaration Book 63 year of 2020 using Electronic Document Management System at ICTS'),('28f806f0-0ed2-4949-a108-d0be354fb7bc','13626d8e-5b18-4767-991a-b827d2da8278',2,'Activated (2) Ms Office 2016 at MDRRMO'),('2c88b8ea-f5e1-4cf3-a2b1-309043f6b9a6','d6ff3e4e-e817-4783-ba36-89f366680a5a',4,'Backup Photos and Videos at ICT Office'),('2e0c0f0e-14a1-46ed-9a06-255f4f6d3c09','d6ff3e4e-e817-4783-ba36-89f366680a5a',5,'Preparation of the Laughter Therapy and other activities for the 126th Civil Service Month'),('30848bbf-f44c-49de-8ae1-635b77dfe28b','3d4790c2-5dfc-4e0b-a787-9d4e7f5a20cd',2,'Troubleshoot internet connection at Sloughter  House'),('32f6865d-6791-48d5-a136-cda0f63330ea','c0614471-e2de-4207-931f-307c0df30190',0,'Video Documentation of 126th Civil Service Month Celebration: Opening Ceremony and Games of 2-Day League at Brgy. Buliasnin Covered Court'),('3634be75-8fa9-447b-a50d-ea44e9a513a2','d237c01f-6b4c-4caf-8352-31bfe856272d',2,'Assisted in Reviewing of CCTV Footage at ICTS Office'),('3a1d9465-9869-4784-8bcd-fb6fe4c73780','b3ae4ab1-345f-45df-8e65-75e70c26ea84',4,'Troubleshoot Printer EPSON L220 at Civil Registrar\'s Office (Ink Waste Pad Reset and Mechanical Error)'),('3b01b742-096d-4a38-9741-60f72c9d1fe4','b3ae4ab1-345f-45df-8e65-75e70c26ea84',5,'Edit and Print ID of an Employee at ICT Office'),('3d98ee8a-5fe5-4709-8c61-01d2536f6911','d237c01f-6b4c-4caf-8352-31bfe856272d',0,'Edited Book 57 of  Tax Declaration in Electronic Document Management System at ICTS Office'),('3e91cedb-d3ba-4505-8514-cf9d955183b2','b3ae4ab1-345f-45df-8e65-75e70c26ea84',1,'Assisted in browsing for the Purchase Requisition of a whole package of Desktop Computer at ICT Office'),('404ee6b2-67c0-4a4a-8d4e-cbe4bee0e0ea','a4dd987f-efc1-44cf-b0e9-7ca1f38eb171',0,'office order'),('448e373f-26cd-4725-b3b8-b4202d26fa09','54300f54-206b-40fa-a695-ebf239fc48be',1,'Surveyed for Point to Point Connection at Slaughter House'),('45537848-9302-4913-8fef-0dcfa410bd5a','9048ebc6-b74b-4407-a6c6-7ee6aa25705c',0,'Imported DTR of RHU II'),('4590d0aa-6b40-4fb3-b095-8119feb10533','7f6c1fea-cdd2-4545-9e02-6e857f2bef6d',1,'Assisted in troubleshooting CCTV Camera (D7, D20) at ICT Office'),('45eb9dc8-b380-4944-9201-d980387d73c3','d6ff3e4e-e817-4783-ba36-89f366680a5a',2,'Troubleshoot Laptop Computer at CASA Real (No Wifi Connection)'),('465a2999-cd82-46f5-b4e4-caad7ce07575','9e7ff415-9b67-4deb-961e-33f806069eda',2,'Review CCTV Isok Waiting Shed'),('4c201e3e-9fb8-43d2-bad8-4c9b7a7a0842','36a6c773-253e-4b88-88f7-f3f7de7d259a',0,'Edited tax declaration EDMS at ICTS Office (2020 Book 65)'),('4e2a9f53-2cb1-4112-8802-ae009ecf97f5','54300f54-206b-40fa-a695-ebf239fc48be',0,'Surveyed for Fiber Optic Cable Installation from Brgy. Hall San Miguel to Slaughter House'),('4e6266b6-0bb2-41a7-ae79-8a0dc491153c','9e7ff415-9b67-4deb-961e-33f806069eda',3,'Review CCTV Blue Building (money missing)'),('4f77f45e-2197-41b6-8d61-755787997b9f','3d4790c2-5dfc-4e0b-a787-9d4e7f5a20cd',4,'Troubleshoot internet connection at HR Office'),('501949fa-dcee-4ddd-90f6-28729862e57f','d6ff3e4e-e817-4783-ba36-89f366680a5a',1,'Photo Documentation of Flag Ceremony at Municipal Building'),('551b96ed-56fb-49d4-91d4-227610aff85e','9a2dca9c-5346-4043-a3d5-7463efbb4f71',2,'Assisted in Printing ID of Employee at ICTS Office'),('5686da49-c6e3-46be-a27a-8e6a39543948','93db53b2-aa66-42f6-8d6a-2aa533ffe6b0',8,'Splice CCTV Camera UTP Cable at Brgy Isok I'),('5b97b89e-1a43-47a2-a592-8515e8684bcf','d6ff3e4e-e817-4783-ba36-89f366680a5a',0,'Troubleshoot Desktop Computer at Civil Registrar\'s Office'),('5dc58f61-858a-4711-9a45-10dadd2397c1','0d113047-a43c-425e-a9a3-1ec3c09133e9',0,'Scanned and uploaded Tax Declaration 2020 Book 75 at IT Office'),('61848e71-b158-4eec-8305-ad26b40cdceb','d6ff3e4e-e817-4783-ba36-89f366680a5a',7,'Edit the Video Presentation of the \"126 Civil Service Month -  2-Day League\" at ICT Office'),('61d4899a-a3ad-40fb-aec6-6704787ab796','6ae80144-b010-4e82-a3f3-4f0e12aee202',0,'Review CCTV camera at Boac Poblacion (D22 & D23)'),('638d0ac6-7150-434d-99fe-8f34f6fbfc0b','93db53b2-aa66-42f6-8d6a-2aa533ffe6b0',1,'Assists Students for Assigning IP Address of Laptop to be connected to the Internet at Mun. Slaughter House'),('670b34fa-0ae9-46a5-84e4-f4dd643aae7e','9e7ff415-9b67-4deb-961e-33f806069eda',0,'Maintenance ALS'),('677db47b-286d-4d05-b7c5-4aade02aa27c','13626d8e-5b18-4767-991a-b827d2da8278',1,'Installed EPSON L5290 Printer Driver at MDRRMO'),('6b4dfa0a-5f0a-4df7-9309-8b4b6052d7d8','0d113047-a43c-425e-a9a3-1ec3c09133e9',3,'Assisted immersion students in recnfiguration and testing of CCTV camera'),('741732be-5bff-497d-9a63-ff82dc7eaaa9','13626d8e-5b18-4767-991a-b827d2da8278',5,'Maintenance Box replacement of EPSON L6190 Printer at MDRRMO'),('785f74de-3229-4cfe-8d06-033c1261233d','72b9e775-efb7-42cf-b1c3-13b90a65f131',0,'Imported DTR of Main Building, Market, RHU, Agri and MSWDO'),('7af0cedd-3d40-4801-9ed1-8546b62ec69c','e071a4bb-e2a0-47fb-aeae-883b36a4d339',2,'Assisted in troubleshooting internet connection at MCR Office'),('7bb5298a-ffbd-4919-a607-e9c74a41f585','705a7660-9a53-4998-ad42-694452351503',1,'Troubleshoot Printer EPSON L5290 at SB - Secretariat (Paper Jam)'),('7c3cf310-63d1-4948-8a4b-540889d139ae','99e15437-c0a0-4fea-bbb2-7df14afb45a2',1,'Assisted in Printing ID of new Employee at ICTS Office'),('7e40960e-4c6f-406d-8a99-be8e1a2dd3e5','c0614471-e2de-4207-931f-307c0df30190',2,'Assisted in Troubleshooting EPSON L5290 Printer at SB-Secretariat (Paper Jam)'),('7e8242dd-76ce-4f6e-a47c-32d696e63508','93db53b2-aa66-42f6-8d6a-2aa533ffe6b0',4,'Troubleshoot CCTV Camera at Brgy. Isok I (Re-terminated UTP Cable)'),('8154b95e-7bf9-44cf-b363-47c975e3826f','705a7660-9a53-4998-ad42-694452351503',2,'Backup photos and videos at ICT Office'),('822df083-1463-42d4-942f-c1c7f81f4c80','7a359620-bba6-41ed-9f4c-aa8171c0ca23',1,'Activate Microsoft Office at Supply Office'),('82415b4e-0ce9-4019-a513-65124815d05d','642da126-c9b8-4619-86c5-af43cab9ce2f',0,'Review CCTV Camera of Boac Poblcion at IT Office'),('84c4fa14-ab5a-4f2f-a4c6-77aba9622014','e071a4bb-e2a0-47fb-aeae-883b36a4d339',1,'Assidted in troubleshooting desktop from MSWDO'),('882ef2bc-3603-459d-830d-3b5605503410','9a2dca9c-5346-4043-a3d5-7463efbb4f71',1,'Edited Book 60 of  Tax Declaration in Electronic Document Management System at ICTS Office'),('886c5bb4-319c-4b66-a67a-c753f2d4e037','7f6c1fea-cdd2-4545-9e02-6e857f2bef6d',0,'Edit the Video Presentation of the \"126 Civil Service Month - Coastal Cleanup/Mangrove Tree Planting\" at Brgy. Tabigue'),('88d1e234-e9cc-45b5-ae61-0a88496fd5a8','b3ae4ab1-345f-45df-8e65-75e70c26ea84',3,'Finalize the Video Presentation of the \"Breastfeeding Awareness Month\" at ICT Office'),('890e45d7-c46f-4e06-b6e1-f314be8f69b5','7f6c1fea-cdd2-4545-9e02-6e857f2bef6d',2,'Finalize the Video Presentation of the \"126th Civil Service Month - 2-Day League (Basketball, Volleyball, and Pickleball) at Brgy. Buliasnin, Covered Court'),('8c2ab6a2-4b11-4bef-a736-eff105be8fc5','1296123a-12c9-4dd0-b441-6665f6bec39c',2,'Troubleshoot EPSON L5290 at ICTS Office'),('8eee3205-fe50-4602-9d09-9eba955eb24b','13626d8e-5b18-4767-991a-b827d2da8278',3,'Test Print EPSON L5290 Printer at MDRRMO'),('91e043f5-a922-419c-bc52-524be5e45e70','1296123a-12c9-4dd0-b441-6665f6bec39c',0,'Assisted in troubleshooting EPSON L220 from RHU II'),('930aed65-75d6-44a2-81e8-a3d78e48a54a','93db53b2-aa66-42f6-8d6a-2aa533ffe6b0',7,'Fix Viewing of CCTV Camera at Brgy. Murallon'),('948f814d-7533-4851-ab4d-7fea6478695c','b3ae4ab1-345f-45df-8e65-75e70c26ea84',2,'Troubleshoot Internet Connection at HRM Office'),('9a1d33d4-9717-442e-9352-15434d82e8af','9a2dca9c-5346-4043-a3d5-7463efbb4f71',0,'Assisted in Troubleshooting CCTV at Poblacion'),('9b281735-a626-4196-8662-4b10527a3d74','705a7660-9a53-4998-ad42-694452351503',0,'Photo and Video Documentation of the \"126th Civil Service Month - 2 Day League (Basketball, Volleyball, Pickleball) - Day 1\"'),('9b487d29-3d9b-47f0-a1eb-b60f4702b0bc','1296123a-12c9-4dd0-b441-6665f6bec39c',1,'Troubleshoot desktop computer at MCR Office'),('9b6e8fcb-808a-438c-9a56-84d56f16e015','7a359620-bba6-41ed-9f4c-aa8171c0ca23',3,'Edit and print employee ID from SB-Leg'),('9e3c2d2c-2039-46cc-b1cc-3c0fca9fb5b9','7a359620-bba6-41ed-9f4c-aa8171c0ca23',4,'Import DTR at MSWDO and MDRRMO'),('a3d5f74a-1a43-4682-9a42-c1f0ace03bc3','6ae80144-b010-4e82-a3f3-4f0e12aee202',3,'Troubleshoot epson scanner at IT Office'),('a53162e1-6f35-46fb-9b39-5c0003f02a09','d6ff3e4e-e817-4783-ba36-89f366680a5a',6,'Review the CCTV Camera (D10, D11, D16) at ICT Office - Overpricing Tricycle Driver'),('a8d09ef8-d109-4cdb-baf9-a6bbfa5f1796','72b9e775-efb7-42cf-b1c3-13b90a65f131',2,'Troubleshoot Power Supply Unit at ICTS Office'),('abe98477-0af0-473b-be90-b8ce19e3343b','0d113047-a43c-425e-a9a3-1ec3c09133e9',2,'Replce and troubleshoot CCTV at Boac poblacion (D7)'),('ace4f186-6929-41e2-bd73-d9cc3d6262a1','e44f5aa1-9b9d-48e0-8f69-b579bf59a775',2,'Re-import of DTR of MDRRMO at ICTS Office'),('b0488fea-a2cf-47eb-a477-779a57107b41','705a7660-9a53-4998-ad42-694452351503',3,'Edit and Print ID of an Employee at ICT Office'),('b1f0801f-9cc0-4955-af96-efb0236cadd6','6ae80144-b010-4e82-a3f3-4f0e12aee202',2,'Edited tax declaration EDMS at ICTS Office (2020 Book 55 & 56)'),('b39a9364-3dc2-452c-ba19-bb636dba4998','7a359620-bba6-41ed-9f4c-aa8171c0ca23',0,'Scanned and uploaded Tax Declaration 2020 Book 59 at IT  Office'),('b61ad591-57c2-4e11-a17f-a03100747744','93db53b2-aa66-42f6-8d6a-2aa533ffe6b0',5,'Assist Students for Re-configuring (2) CCTV Camera at IT Office'),('b6332dcc-2688-41a5-a1d0-865283f6987f','3d4790c2-5dfc-4e0b-a787-9d4e7f5a20cd',1,'Installed UTP cable for desktop internet connection at MTO'),('bc73f33c-8267-48ed-b43f-e5bdb544382f','99e15437-c0a0-4fea-bbb2-7df14afb45a2',2,'Troubleshoot OKI Scanner (paper jam) at ICTS Office'),('bebf0540-d93c-48d7-b1ad-5e9e8872d425','eeb613ad-894f-4964-b06c-05944a296153',1,'Backup photos and videos at ICT Office'),('bf31f9ad-48f2-4961-b280-398d8c95a683','13626d8e-5b18-4767-991a-b827d2da8278',4,'Installed EPSON L6190 Printer Driver at MDRRMO'),('bf6b0aeb-ee29-43fb-90dc-ff03c6efb219','93db53b2-aa66-42f6-8d6a-2aa533ffe6b0',3,'Troubleshoot CCTV Camera at Brgy. Murallon (Re-terminated UTP Cable)'),('c2fc0c50-b173-4723-80c7-bb7b015dee77','c0614471-e2de-4207-931f-307c0df30190',1,'Backup Files at IT Office'),('c3b79e2e-3e71-48d1-a691-888104a963b5','99e15437-c0a0-4fea-bbb2-7df14afb45a2',0,'Scanned and Uploaded Tax Declaration Book 70 year of 2020 using Electronic Document Management System at ICTS'),('c915fd9a-ac05-4dbc-a10f-e3b9ebc7cf5c','642da126-c9b8-4619-86c5-af43cab9ce2f',2,'Backup Files at IT Office'),('cc560122-5e03-4702-bef5-7d6473955908','13626d8e-5b18-4767-991a-b827d2da8278',0,'Setup (2) EPSON L5290 Printer at MDRRMO'),('dbd5d264-0512-4082-bfb4-5053af337c4c','0d113047-a43c-425e-a9a3-1ec3c09133e9',1,'Troubleshoot CCTV at Boac Poblacion (D20)'),('dffc36e6-ccae-473d-9001-c3eb11c27336','1296123a-12c9-4dd0-b441-6665f6bec39c',3,'Assisted in troubleshooting Desktop Computer from MSWDO'),('e576134e-f206-4609-b79e-d8a9c045aa45','6ae80144-b010-4e82-a3f3-4f0e12aee202',1,'Troubleshoot printer at Admin Office'),('e5cb03e5-a7f8-4737-8ae3-bb9e18dd138f','7f6c1fea-cdd2-4545-9e02-6e857f2bef6d',3,'Edit and Print of PVC ID of an Employee (2)'),('e9a89164-7cbd-4339-8666-82a93a913e93','72b9e775-efb7-42cf-b1c3-13b90a65f131',1,'Maintenance ALS'),('ede12f66-d0f9-4024-b070-3d0a5841a6af','93db53b2-aa66-42f6-8d6a-2aa533ffe6b0',6,'CCTV Camera Replacement at Brgy. Murallon'),('f0292ad0-9d07-4d92-9abc-ce61b8086057','3d4790c2-5dfc-4e0b-a787-9d4e7f5a20cd',3,'Survey possible route for fiber optic cable from Municipal Building to MDRRMO'),('f5b7b9db-c836-4d84-baef-987cac340813','d237c01f-6b4c-4caf-8352-31bfe856272d',1,'Assisted in Troubleshooting of Desktop Computer at Municipal Civil Registry Office'),('f60c448d-f1b0-4dcc-bb47-8d18a0a86427','b3ae4ab1-345f-45df-8e65-75e70c26ea84',0,'Edit the Video Presentation of the \"126th Civil Service Month - 2-Day League (Basketball, Volleyball, and Pickleball) at Brgy. Buliasnin, Covered Court'),('f65301d1-3cbe-42c7-a597-d211c46a584f','642da126-c9b8-4619-86c5-af43cab9ce2f',1,'Video Documentation of 126th Civil Service Month Celebration: 2-Day League Championship at Brgy. Buliasnin Covered Court'),('fc19ac33-85dc-40cc-b1eb-6890f1c636d1','e44f5aa1-9b9d-48e0-8f69-b579bf59a775',1,'Assisted in Reviewing CCTV Footage at ICTS Office'),('fe4bdaec-504b-49db-bad6-c28a11c4be17','13626d8e-5b18-4767-991a-b827d2da8278',6,'Nozzle Check and Test Print EPSON L6190 at MDRRMO');
/*!40000 ALTER TABLE `accomplishment_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `holidays`
--

DROP TABLE IF EXISTS `holidays`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `holidays` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `holiday_date` date NOT NULL,
  `name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` enum('Regular','Special') COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_holidays_date` (`holiday_date`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `holidays`
--

LOCK TABLES `holidays` WRITE;
/*!40000 ALTER TABLE `holidays` DISABLE KEYS */;
/*!40000 ALTER TABLE `holidays` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `offices`
--

DROP TABLE IF EXISTS `offices`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `offices` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(24) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_offices_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `offices`
--

LOCK TABLES `offices` WRITE;
/*!40000 ALTER TABLE `offices` DISABLE KEYS */;
INSERT INTO `offices` VALUES ('00000000-0000-4000-8000-000000000000','LGU','Municipality of Boac',1,'2026-09-15 09:36:13','2026-09-15 09:36:13'),('00000000-0000-4000-8000-000000000001','MPDO','Municipal Planning and Development Office',1,'2026-09-15 09:12:00','2026-09-15 09:12:00'),('00000000-0000-4000-8000-000000000002','MEO','Municipal Engineering Office',1,'2026-09-15 09:12:00','2026-09-15 09:12:00'),('00000000-0000-4000-8000-000000000003','MHO','Municipal Health Office',1,'2026-09-15 09:12:00','2026-09-15 09:12:00'),('00000000-0000-4000-8000-000000000004','HRMO','Human Resource Management Office',1,'2026-09-15 09:12:00','2026-09-15 09:12:00'),('00000000-0000-4000-8000-000000000005','MAO','Municipal Agriculture Office',1,'2026-09-15 09:12:00','2026-09-15 09:12:00'),('00000000-0000-4000-8000-000000000006','MSWDO','Municipal Social Welfare and Development Office',1,'2026-09-15 09:12:00','2026-09-15 09:12:00'),('00000000-0000-4000-8000-000000000007','MBO','Municipal Budget Office',1,'2026-09-15 09:12:00','2026-09-15 09:12:00'),('00000000-0000-4000-8000-000000000008','MTO','Municipal Treasurer\'s Office',1,'2026-09-15 09:12:00','2026-09-15 09:12:00'),('00000000-0000-4000-8000-000000000009','MAYOR','Office of the Mayor',1,'2026-09-15 10:42:55','2026-09-15 10:50:38');
/*!40000 ALTER TABLE `offices` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `report_entries`
--

DROP TABLE IF EXISTS `report_entries`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `report_entries` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `report_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `entry_date` date NOT NULL,
  `entry_label` varchar(40) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_report_entries_date` (`report_id`,`entry_date`),
  CONSTRAINT `fk_report_entries_report` FOREIGN KEY (`report_id`) REFERENCES `reports` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `report_entries`
--

LOCK TABLES `report_entries` WRITE;
/*!40000 ALTER TABLE `report_entries` DISABLE KEYS */;
INSERT INTO `report_entries` VALUES ('00b4ae18-1647-4a66-9916-c353ea330c75','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-25',NULL,'2026-09-23 17:40:46'),('00f82534-d11f-4a77-b1c7-5e4fde337654','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-18',NULL,'2026-09-23 17:40:46'),('027498ff-0be9-4ebc-a349-421499fe325d','a3bf888d-062f-43dc-814f-92e576826918','2026-09-10',NULL,'2026-09-23 11:20:30'),('087359bc-0a18-4e09-b300-08d4f8749360','a3bf888d-062f-43dc-814f-92e576826918','2026-09-15',NULL,'2026-09-23 11:20:30'),('0881ea81-ba46-4a03-a0dd-bd374c23deef','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-30',NULL,'2026-09-23 17:20:03'),('0cef512e-1cb0-4532-ba8b-56f2ca791553','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-26',NULL,'2026-09-23 17:20:03'),('0d113047-a43c-425e-a9a3-1ec3c09133e9','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-23',NULL,'2026-09-23 17:20:03'),('0d2224cd-5cf8-47ef-b1af-24d43fd6770f','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-26',NULL,'2026-09-23 17:40:46'),('0e029714-06a4-4d13-9816-cccf211ef9b8','a3bf888d-062f-43dc-814f-92e576826918','2026-09-02',NULL,'2026-09-23 11:20:30'),('1095ad17-4b86-4d3e-9148-6080ce5f0595','a3bf888d-062f-43dc-814f-92e576826918','2026-09-06',NULL,'2026-09-23 11:20:30'),('10a0fc3e-d9ca-4635-baf0-2f85da1f7ed2','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-29',NULL,'2026-09-23 11:20:39'),('10c716cf-915f-4749-9f1c-100f2079e79d','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-26',NULL,'2026-09-23 17:20:17'),('1296123a-12c9-4dd0-b441-6665f6bec39c','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-22',NULL,'2026-09-23 10:03:06'),('13626d8e-5b18-4767-991a-b827d2da8278','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-21',NULL,'2026-09-23 17:40:46'),('1964af7f-eec6-43b1-8278-40489225e7ea','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-18',NULL,'2026-09-23 11:20:39'),('1d7cde9c-9d6f-498a-af61-90cea875b75f','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-28',NULL,'2026-09-23 17:40:46'),('1e5fc2b6-7ec6-4890-a5ed-d298b5fc9e4a','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-30',NULL,'2026-09-23 10:03:06'),('1f286284-d20d-49da-9b9b-44f84772ff49','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-28',NULL,'2026-09-23 11:20:39'),('2678df5f-283a-4afe-8963-9790f0e36f0c','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-19',NULL,'2026-09-23 11:20:39'),('28bebecc-a0c5-458c-9036-db3ade794d0b','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-20',NULL,'2026-09-23 17:20:17'),('29db31eb-418f-4833-8ad8-ee8e85577857','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-20',NULL,'2026-09-23 10:03:06'),('36a6c773-253e-4b88-88f7-f3f7de7d259a','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-24',NULL,'2026-09-23 17:20:03'),('3b667eab-627e-481e-bbb6-0c6797a5be8e','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-18','FRIDAY','2026-09-23 10:03:06'),('3c8ee1a6-c508-4bd1-8d45-7445337dd44e','a3bf888d-062f-43dc-814f-92e576826918','2026-09-13',NULL,'2026-09-23 11:20:30'),('3d4790c2-5dfc-4e0b-a787-9d4e7f5a20cd','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-22',NULL,'2026-09-23 17:20:03'),('40935e51-8fab-43db-81e0-5a0d6b3d192f','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-25',NULL,'2026-09-23 11:20:39'),('40dc4e07-9fa9-4024-a14b-f7b19ce1be49','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-18','Friday','2026-09-23 17:20:17'),('4240351a-6c04-4288-a436-74d87089e2ab','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-27',NULL,'2026-09-23 10:03:06'),('4f3ea876-0176-4587-bad2-d55349fa18ac','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-25','Friday','2026-09-23 17:20:17'),('54300f54-206b-40fa-a695-ebf239fc48be','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-22',NULL,'2026-09-23 17:40:46'),('5a7bc699-10ad-4927-8462-648ba7a35c11','a3bf888d-062f-43dc-814f-92e576826918','2026-09-04',NULL,'2026-09-23 11:20:30'),('6062d1cc-a4c2-4dcc-b428-08213af896cb','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-28',NULL,'2026-09-23 17:20:17'),('642da126-c9b8-4619-86c5-af43cab9ce2f','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-17',NULL,'2026-09-23 17:40:46'),('65516b46-e03b-44b4-a4a5-9464b3625fe7','a3bf888d-062f-43dc-814f-92e576826918','2026-09-11',NULL,'2026-09-23 11:20:30'),('6ae80144-b010-4e82-a3f3-4f0e12aee202','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-17',NULL,'2026-09-23 17:20:03'),('6c0bc7ee-2c36-4835-b472-bc242b2ec971','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-30',NULL,'2026-09-23 17:40:46'),('6c0e0e74-2e88-4cdc-9d2d-69d830b85282','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-29',NULL,'2026-09-23 17:20:03'),('6cfe31a2-ae34-4f03-bda8-ec084baa9308','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-18','FRIDAY','2026-09-23 17:20:03'),('6e72c2bc-4b1c-49c7-97d8-52a53be6bd41','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-29',NULL,'2026-09-23 17:20:17'),('705a7660-9a53-4998-ad42-694452351503','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-16',NULL,'2026-09-23 11:20:39'),('72b9e775-efb7-42cf-b1c3-13b90a65f131','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-16',NULL,'2026-09-23 10:03:06'),('73cb3eac-69c7-4f33-9185-96b643e40015','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-24',NULL,'2026-09-23 17:40:46'),('7872a267-2a81-4fa3-9dee-1449739e3d6b','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-30',NULL,'2026-09-23 17:20:17'),('7a359620-bba6-41ed-9f4c-aa8171c0ca23','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-16',NULL,'2026-09-23 17:20:03'),('7d0eb6e0-2465-4120-a19c-829be09e73dc','a3bf888d-062f-43dc-814f-92e576826918','2026-09-08',NULL,'2026-09-23 11:20:30'),('7e81fed1-994f-4dd9-8f0e-02bf22c31dd5','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-24',NULL,'2026-09-23 10:03:06'),('7f6c1fea-cdd2-4545-9e02-6e857f2bef6d','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-23',NULL,'2026-09-23 11:20:39'),('810529d3-6759-4491-b54e-bfa4c15b273c','a3bf888d-062f-43dc-814f-92e576826918','2026-09-07',NULL,'2026-09-23 11:20:30'),('84f96fc0-6b30-4b4f-aa01-86cf38c6ab02','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-20',NULL,'2026-09-23 11:20:39'),('8b9d9b2a-5cde-4ebe-86ee-f26b0ee141e0','a3bf888d-062f-43dc-814f-92e576826918','2026-09-09',NULL,'2026-09-23 11:20:30'),('8e46b3e3-a5da-49fa-a1bd-e5badd023b59','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-27',NULL,'2026-09-23 17:40:46'),('8fd35f4c-9101-4eb8-bb50-010cf631dba1','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-27',NULL,'2026-09-23 17:20:17'),('9048ebc6-b74b-4407-a6c6-7ee6aa25705c','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-21',NULL,'2026-09-23 10:03:06'),('93db53b2-aa66-42f6-8d6a-2aa533ffe6b0','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-23',NULL,'2026-09-23 17:40:46'),('96c0eda3-4d1b-46ea-8d3b-9162106f9f3d','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-19',NULL,'2026-09-23 10:03:06'),('98d03228-431a-4d3c-ab62-892a4cffb71f','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-25','FRIDAY','2026-09-23 17:20:03'),('99b707c1-c0f4-435a-8e80-c3e2fc6a6553','a3bf888d-062f-43dc-814f-92e576826918','2026-09-12',NULL,'2026-09-23 11:20:30'),('99e15437-c0a0-4fea-bbb2-7df14afb45a2','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-22',NULL,'2026-09-23 17:20:17'),('9a2dca9c-5346-4043-a3d5-7463efbb4f71','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-23',NULL,'2026-09-23 17:20:17'),('9a51aff2-bc4f-4ffe-9296-78d0fb5f141d','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-28',NULL,'2026-09-23 17:20:03'),('9e7ff415-9b67-4deb-961e-33f806069eda','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-17',NULL,'2026-09-23 10:03:06'),('9f92ffeb-ed95-4c17-8005-683d38234a49','a3bf888d-062f-43dc-814f-92e576826918','2026-09-05',NULL,'2026-09-23 11:20:30'),('a4dd987f-efc1-44cf-b0e9-7ca1f38eb171','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-16',NULL,'2026-09-23 17:20:17'),('a682a514-59a6-44da-b9a3-710cd4b93c2a','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-30',NULL,'2026-09-23 11:20:39'),('a8776cf9-b020-4000-8267-b5f29d31141c','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-20',NULL,'2026-09-23 17:40:46'),('aa9e9b00-12b9-4f1a-9865-d0c9d25b5a86','a3bf888d-062f-43dc-814f-92e576826918','2026-09-01',NULL,'2026-09-23 11:20:30'),('aef68b9f-56fc-4c57-8c72-f9f9e254c5b6','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-20',NULL,'2026-09-23 17:20:03'),('b183a42f-924d-4f40-a427-aa4e9a2ba7af','a3bf888d-062f-43dc-814f-92e576826918','2026-09-14',NULL,'2026-09-23 11:20:30'),('b3ae4ab1-345f-45df-8e65-75e70c26ea84','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-22',NULL,'2026-09-23 11:20:39'),('c0614471-e2de-4207-931f-307c0df30190','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-16',NULL,'2026-09-23 17:40:46'),('c6aedcef-f7b5-420c-8997-d8441c046fa8','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-19',NULL,'2026-09-23 17:20:03'),('cb94163d-a740-462a-be34-37ed79e0dd3d','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-27',NULL,'2026-09-23 11:20:39'),('d237c01f-6b4c-4caf-8352-31bfe856272d','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-21',NULL,'2026-09-23 17:20:17'),('d6370998-b473-4db1-8d39-05a7d3238318','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-26',NULL,'2026-09-23 10:03:06'),('d6ff3e4e-e817-4783-ba36-89f366680a5a','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-21',NULL,'2026-09-23 11:20:39'),('d75a15b2-0e0d-4845-9df5-eb70709d15bf','a3bf888d-062f-43dc-814f-92e576826918','2026-09-03',NULL,'2026-09-23 11:20:30'),('e071a4bb-e2a0-47fb-aeae-883b36a4d339','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-21',NULL,'2026-09-23 17:20:03'),('e32545b8-f3f0-4176-8fc6-0ae9235a568d','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-24',NULL,'2026-09-23 11:20:39'),('e44f5aa1-9b9d-48e0-8f69-b579bf59a775','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-17',NULL,'2026-09-23 17:20:17'),('e84824dd-7170-4a1e-986a-a98b23ad3075','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-23',NULL,'2026-09-23 10:03:06'),('e8549d4b-ef8a-4120-a920-89f49da8735e','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-29',NULL,'2026-09-23 10:03:06'),('edd3739c-6584-47f7-a160-dbdae4ebeacd','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-24',NULL,'2026-09-23 17:20:17'),('eeb613ad-894f-4964-b06c-05944a296153','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-17',NULL,'2026-09-23 11:20:39'),('ef2fceb9-ccc0-47f1-9e09-f6ec5d4bf32d','ee412865-bf97-4ef4-a1e1-d1136b58a0ef','2026-09-26',NULL,'2026-09-23 11:20:39'),('f020c521-89d5-470d-8430-b76f66c41e17','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-25','FRIDAY','2026-09-23 10:03:06'),('f0a8cfcc-3816-4bf9-a2a4-5d7746ee9c0c','fadacf37-079e-40a0-a54f-6dcbdd67cb2f','2026-09-28',NULL,'2026-09-23 10:03:06'),('f795bb0b-72dc-49ac-9eb5-2902b720a6c5','9e6a4c84-ece4-4144-b391-ba972f4d6b1b','2026-09-19',NULL,'2026-09-23 17:20:17'),('f93e7d58-dbee-4ed0-abc5-506e4d21de29','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-29',NULL,'2026-09-23 17:40:46'),('fa273b80-61ad-4ec9-9bef-918d4249d68c','f68f8866-92b2-4c56-b769-bfabb213858a','2026-09-27',NULL,'2026-09-23 17:20:03'),('fd4ec4f8-008b-4ea1-936b-b17ceb25ef75','54a6e39b-240f-4fde-a015-f9f7e2803f09','2026-09-19',NULL,'2026-09-23 17:40:46');
/*!40000 ALTER TABLE `report_entries` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `employee_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `title` varchar(220) COLLATE utf8mb4_unicode_ci NOT NULL,
  `office_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `period_start` date NOT NULL,
  `period_end` date NOT NULL,
  `status` enum('Draft','Finalized') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'Draft',
  `prepared_by_name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `prepared_by_position` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `noted_by_name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `noted_by_position` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_reports_employee_updated` (`employee_id`,`updated_at`),
  KEY `idx_reports_office_period` (`office_id`,`period_start`,`period_end`),
  CONSTRAINT `fk_reports_employee` FOREIGN KEY (`employee_id`) REFERENCES `users` (`id`) ON DELETE CASCADE,
  CONSTRAINT `fk_reports_office` FOREIGN KEY (`office_id`) REFERENCES `offices` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reports`
--

LOCK TABLES `reports` WRITE;
/*!40000 ALTER TABLE `reports` DISABLE KEYS */;
INSERT INTO `reports` VALUES ('54a6e39b-240f-4fde-a015-f9f7e2803f09','45f0c6bc-4952-4825-bf3c-3c09ac20e3eb','Accomplishment Report — September 16–30, 2026','00000000-0000-4000-8000-000000000009','2026-09-16','2026-09-30','Draft','Carmelo C. Manguera Jr.','Administrative Aide I','JACOB M. MONTEVIRGEN, ECE','IT Officer I','2026-09-21 09:21:51','2026-09-23 17:40:46'),('9e6a4c84-ece4-4144-b391-ba972f4d6b1b','b432e94d-b491-407a-857b-2fa5463bb3a3','Accomplishment Report — September 16–30, 2026','00000000-0000-4000-8000-000000000009','2026-09-16','2026-09-30','Draft','LARK LOUIE M. RABI','Administrative Aide I','JACOB M. MONTEVIRGEN, ECE','IT Officer I','2026-09-17 17:23:03','2026-09-23 17:20:17'),('a3bf888d-062f-43dc-814f-92e576826918','273255d4-9ee2-4952-9844-ef2d8e2d363a','Accomplishment Report — September 1–15, 2026','00000000-0000-4000-8000-000000000009','2026-09-01','2026-09-15','Finalized','Blessious Joseph T. Landoy','Administrative Aide I','Jacob Montevirgen','IT Officer I','2026-09-15 09:42:22','2026-09-23 11:20:30'),('ee412865-bf97-4ef4-a1e1-d1136b58a0ef','118fc542-2420-4f76-8cf2-7fa6f738ed65','Accomplishment Report — September 16–30, 2026','00000000-0000-4000-8000-000000000009','2026-09-16','2026-09-30','Draft','Mark Limuel M. Mapacpac','Administrative Aide I','JACOB M. MONTEVIRGEN, ECE','IT Officer I','2026-09-21 09:31:08','2026-09-23 11:20:38'),('f68f8866-92b2-4c56-b769-bfabb213858a','c3670df4-d373-4886-875f-28c8d1590b71','Accomplishment Report — September 16–30, 2026','00000000-0000-4000-8000-000000000009','2026-09-16','2026-09-30','Draft','JHON KENNETTE M. MANTAL','Administrative Aide I','JACOB M. MONTEVIRGEN, ECE','IT Officer I','2026-09-17 11:46:07','2026-09-23 17:20:03'),('fadacf37-079e-40a0-a54f-6dcbdd67cb2f','273255d4-9ee2-4952-9844-ef2d8e2d363a','Accomplishment Report — September 1–15, 2026','00000000-0000-4000-8000-000000000009','2026-09-16','2026-09-30','Draft','Blessious Joseph T. Landoy','Administrative Aide I','JACOB M. MONTEVIRGEN, ECE','IT Officer I','2026-09-15 11:41:05','2026-09-23 10:03:06');
/*!40000 ALTER TABLE `reports` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sessions`
--

DROP TABLE IF EXISTS `sessions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `sessions` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token_hash` char(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `expires_at` datetime NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `last_seen_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_sessions_token_hash` (`token_hash`),
  KEY `idx_sessions_user_expires` (`user_id`,`expires_at`),
  CONSTRAINT `fk_sessions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sessions`
--

LOCK TABLES `sessions` WRITE;
/*!40000 ALTER TABLE `sessions` DISABLE KEYS */;
INSERT INTO `sessions` VALUES ('965e4d47-4bd3-4d27-8f68-f8b4fd2818c4','c3670df4-d373-4886-875f-28c8d1590b71','f263f4d74158f7839e1ee6dd8b5482a9eacc619bdbc3315a13ce93d2d8c0ebf3','2026-09-30 09:16:53','2026-09-23 17:16:53','2026-09-23 17:20:03'),('ea259d0b-51ee-44e2-b4b6-57fbb2b465b1','45f0c6bc-4952-4825-bf3c-3c09ac20e3eb','2e005507cb7e81517d6fc9f3a4223726b9eecc008ce20d5c64f040a52e1b38d3','2026-09-30 09:14:54','2026-09-23 17:14:54','2026-09-23 17:40:46');
/*!40000 ALTER TABLE `sessions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password_hash` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `full_name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(80) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `position_title` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `office_id` char(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('employee','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'employee',
  `active` tinyint(1) NOT NULL DEFAULT '1',
  `noted_by_name` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `noted_by_position` varchar(180) COLLATE utf8mb4_unicode_ci NOT NULL,
  `must_change_password` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_username` (`username`),
  KEY `idx_users_office_id` (`office_id`),
  CONSTRAINT `fk_users_office` FOREIGN KEY (`office_id`) REFERENCES `offices` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES ('118fc542-2420-4f76-8cf2-7fa6f738ed65','mark_koyy','$2b$12$aHs3BYmMXtrWauhWZ5QjpeAB26yPTNjb5xFLVYpEOiPjKN8E.8Kh6','Mark Limuel M. Mapacpac','Koyy','Administrative Aide I','00000000-0000-4000-8000-000000000009','employee',1,'JACOB M. MONTEVIRGEN, ECE','IT Officer I',0,'2026-09-21 09:31:00','2026-09-21 09:31:00'),('273255d4-9ee2-4952-9844-ef2d8e2d363a','blessious','$2b$12$prTpupaouqZYpoHQZTwdaeU39m6eqWEk7jqiAesbWGZM/tQJi4Fee','Blessious Joseph T. Landoy','Bless','Administrative Aide I','00000000-0000-4000-8000-000000000009','employee',1,'JACOB M. MONTEVIRGEN, ECE','IT Officer I',0,'2026-09-15 09:38:18','2026-09-17 17:21:23'),('31b0544d-4675-4639-9c11-e2c0d54ccc92','admin','$2b$12$04dyPx3N8r8UzFIp7Y5dWejQkPOCdiePAir05EwaoJmZJ.7h5BT2K','LGU System Administrator','','System Administrator','00000000-0000-4000-8000-000000000009','admin',1,'LGU System Administrator','System Administrator',0,'2026-09-15 09:18:23','2026-09-23 09:51:19'),('45f0c6bc-4952-4825-bf3c-3c09ac20e3eb','caramellojr','$2b$12$/7/aBDXX29K2qlVim.NgbOOpVbFJGHEroPVl7Iybo4gEbRbVMgBL2','Carmelo C. Manguera Jr.','Meloy','Administrative Aide I','00000000-0000-4000-8000-000000000009','employee',1,'JACOB M. MONTEVIRGEN, ECE','IT Officer I',0,'2026-09-21 09:21:46','2026-09-21 09:21:46'),('b432e94d-b491-407a-857b-2fa5463bb3a3','larkkyyy02','$2b$12$p8SXrFtd1sxf1fNVM9K5xuvdekbHVS3.00gEA7vPuqy9VkBfQqEqC','LARK LOUIE M. RABI','lark','Administrative Aide I','00000000-0000-4000-8000-000000000009','employee',1,'JACOB M. MONTEVIRGEN, ECE','IT Officer I',0,'2026-09-17 17:22:38','2026-09-17 17:22:38'),('c3670df4-d373-4886-875f-28c8d1590b71','qwer','$2b$12$x0J6/sJu0EDOuALcZ5Xrb.SSHh1KJ7YpGRszLRtSRemK3u82SdLva','JHON KENNETTE M. MANTAL',NULL,'Administrative Aide I','00000000-0000-4000-8000-000000000009','employee',1,'JACOB M. MONTEVIRGEN, ECE','IT Officer I',0,'2026-09-17 11:46:04','2026-09-17 11:46:04');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'boac_accomplishment_hub'
--

--
-- Dumping routines for database 'boac_accomplishment_hub'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-09-28  8:05:20
