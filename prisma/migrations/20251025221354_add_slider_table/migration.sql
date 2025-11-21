-- CreateTable
CREATE TABLE `sliders` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `subtitle` VARCHAR(191) NOT NULL,
    `image` VARCHAR(191) NOT NULL,
    `gradident` VARCHAR(191) NOT NULL,
    `smallTitle` VARCHAR(191) NOT NULL,
    `smallSubtitle` VARCHAR(191) NOT NULL,
    `link` VARCHAR(191) NULL,
    `order` INTEGER NOT NULL DEFAULT 0,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
