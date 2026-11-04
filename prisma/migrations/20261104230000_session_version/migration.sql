-- JWT revocation counter, incremented whenever access or password changes.
ALTER TABLE `User`
  ADD COLUMN `sessionVersion` INTEGER NOT NULL DEFAULT 0;
