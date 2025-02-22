/*
  Warnings:

  - You are about to drop the column `createdAt` on the `Model` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Field` DROP FOREIGN KEY `Field_modelId_fkey`;

-- DropIndex
DROP INDEX `Field_modelId_fkey` ON `Field`;

-- AlterTable
ALTER TABLE `Model` DROP COLUMN `createdAt`;

-- AddForeignKey
ALTER TABLE `Field` ADD CONSTRAINT `Field_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `Model`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
