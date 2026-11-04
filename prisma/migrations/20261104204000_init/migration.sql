-- Initial schema for EEPSI FTN (Prisma 7 / MySQL 8).
CREATE TABLE `User` (
  `id` VARCHAR(191) NOT NULL,
  `email` VARCHAR(191) NOT NULL,
  `passwordHash` VARCHAR(255) NOT NULL,
  `name` VARCHAR(120) NOT NULL,
  `role` ENUM('SUPER_ADMIN', 'EDITOR', 'PROFESSOR', 'ASSISTANT', 'STUDENT') NOT NULL DEFAULT 'STUDENT',
  `active` BOOLEAN NOT NULL DEFAULT true,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `User_email_key`(`email`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `News` (
  `id` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `title` VARCHAR(180) NOT NULL,
  `summary` VARCHAR(300) NOT NULL,
  `body` LONGTEXT NOT NULL,
  `status` ENUM('DRAFT','PUBLISHED') NOT NULL DEFAULT 'DRAFT',
  `authorId` VARCHAR(191) NOT NULL,
  `publishedAt` DATETIME(3) NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `updatedAt` DATETIME(3) NOT NULL,
  UNIQUE INDEX `News_slug_key`(`slug`),
  INDEX `News_status_publishedAt_idx`(`status`, `publishedAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Course` (
  `id` VARCHAR(191) NOT NULL,
  `slug` VARCHAR(191) NOT NULL,
  `code` VARCHAR(30) NOT NULL,
  `title` VARCHAR(180) NOT NULL,
  `description` TEXT NOT NULL,
  `semester` INTEGER NOT NULL,
  `studyLevel` VARCHAR(60) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  UNIQUE INDEX `Course_slug_key`(`slug`),
  UNIQUE INDEX `Course_code_key`(`code`),
  INDEX `Course_semester_title_idx`(`semester`, `title`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `CourseMembership` (
  `userId` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `role` ENUM('PROFESSOR','ASSISTANT') NOT NULL,
  INDEX `CourseMembership_courseId_idx`(`courseId`),
  PRIMARY KEY (`userId`, `courseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `Material` (
  `id` VARCHAR(191) NOT NULL,
  `courseId` VARCHAR(191) NOT NULL,
  `title` VARCHAR(180) NOT NULL,
  `url` VARCHAR(1500) NOT NULL,
  `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `Material_courseId_createdAt_idx`(`courseId`, `createdAt`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `News` ADD CONSTRAINT `News_authorId_fkey`
  FOREIGN KEY (`authorId`) REFERENCES `User`(`id`)
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE `CourseMembership` ADD CONSTRAINT `CourseMembership_userId_fkey`
  FOREIGN KEY (`userId`) REFERENCES `User`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `CourseMembership` ADD CONSTRAINT `CourseMembership_courseId_fkey`
  FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE `Material` ADD CONSTRAINT `Material_courseId_fkey`
  FOREIGN KEY (`courseId`) REFERENCES `Course`(`id`)
  ON DELETE CASCADE ON UPDATE CASCADE;
