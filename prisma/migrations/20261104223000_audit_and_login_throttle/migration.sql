-- Audit and account-scoped login throttling (no raw email or passwords stored).
CREATE TABLE `AuditLog` (
  `id` VARCHAR(191) NOT NULL,
  `actorId` VARCHAR(191) NULL,
  `action` VARCHAR(70) NOT NULL,
  `subjectType` VARCHAR(40) NOT NULL,
  `subjectId` VARCHAR(191) NOT NULL,
  `occurredAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  INDEX `AuditLog_occurredAt_idx`(`occurredAt`),
  INDEX `AuditLog_subjectType_subjectId_idx`(`subjectType`, `subjectId`),
  PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

CREATE TABLE `LoginThrottle` (
  `key` VARCHAR(64) NOT NULL,
  `failures` INTEGER NOT NULL DEFAULT 0,
  `resetAt` DATETIME(3) NOT NULL,
  PRIMARY KEY (`key`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

ALTER TABLE `AuditLog` ADD CONSTRAINT `AuditLog_actorId_fkey`
  FOREIGN KEY (`actorId`) REFERENCES `User`(`id`)
  ON DELETE SET NULL ON UPDATE CASCADE;
