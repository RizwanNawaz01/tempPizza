/*
  Warnings:

  - You are about to drop the column `guestEmail` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `guestName` on the `orders` table. All the data in the column will be lost.
  - You are about to drop the column `guestPhone` on the `orders` table. All the data in the column will be lost.
  - Added the required column `orderCode` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `orders` DROP COLUMN `guestEmail`,
    DROP COLUMN `guestName`,
    DROP COLUMN `guestPhone`,
    ADD COLUMN `customerInfo` JSON NULL,
    ADD COLUMN `deliveryType` VARCHAR(191) NOT NULL DEFAULT 'lieferung',
    ADD COLUMN `orderCode` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `cities` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `cities_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `postalcodes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `postalcodes_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_CityToPostalCode` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_CityToPostalCode_AB_unique`(`A`, `B`),
    INDEX `_CityToPostalCode_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_CityToPostalCode` ADD CONSTRAINT `_CityToPostalCode_A_fkey` FOREIGN KEY (`A`) REFERENCES `cities`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_CityToPostalCode` ADD CONSTRAINT `_CityToPostalCode_B_fkey` FOREIGN KEY (`B`) REFERENCES `postalcodes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
