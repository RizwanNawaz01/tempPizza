-- AlterTable
ALTER TABLE `submenus` MODIFY `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- RenameIndex
ALTER TABLE `_citytopostalcode` RENAME INDEX `_CityToPostalCode_AB_unique` TO `_citytopostalcode_AB_unique`;

-- RenameIndex
ALTER TABLE `_citytopostalcode` RENAME INDEX `_CityToPostalCode_B_index` TO `_citytopostalcode_B_index`;
