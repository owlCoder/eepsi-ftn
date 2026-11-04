-- Keep existing materials visible under "Ostalo" after the upgrade.
ALTER TABLE `Material`
  ADD COLUMN `kind` ENUM('LECTURE', 'EXERCISE', 'LAB', 'EXAM', 'OTHER')
  NOT NULL DEFAULT 'OTHER';

CREATE INDEX `Material_courseId_kind_createdAt_idx`
  ON `Material`(`courseId`, `kind`, `createdAt`);
