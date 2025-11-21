-- AlterTable
ALTER TABLE `orders` ADD COLUMN `eta` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `storesettings` ADD COLUMN `order_outside_time` VARCHAR(191) NULL;
