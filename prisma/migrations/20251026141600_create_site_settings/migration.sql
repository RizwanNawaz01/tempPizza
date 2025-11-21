/*
  Warnings:

  - You are about to drop the column `email` on the `storesettings` table. All the data in the column will be lost.
  - You are about to drop the column `openHours` on the `storesettings` table. All the data in the column will be lost.
  - You are about to drop the column `phoneNumber` on the `storesettings` table. All the data in the column will be lost.
  - You are about to drop the column `storeName` on the `storesettings` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `storesettings` DROP COLUMN `email`,
    DROP COLUMN `openHours`,
    DROP COLUMN `phoneNumber`,
    DROP COLUMN `storeName`,
    ADD COLUMN `contact` VARCHAR(191) NULL,
    ADD COLUMN `description` VARCHAR(191) NULL,
    ADD COLUMN `favicon` VARCHAR(191) NULL,
    ADD COLUMN `logo` VARCHAR(191) NULL,
    ADD COLUMN `minOrder` DOUBLE NULL,
    ADD COLUMN `openingHours` JSON NULL,
    ADD COLUMN `services` JSON NULL,
    ADD COLUMN `siteName` VARCHAR(191) NULL,
    ADD COLUMN `title` VARCHAR(191) NULL,
    MODIFY `id` INTEGER NOT NULL DEFAULT 1,
    MODIFY `address` VARCHAR(191) NULL;
