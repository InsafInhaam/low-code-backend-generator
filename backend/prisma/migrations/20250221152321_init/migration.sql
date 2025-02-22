/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `Product`;

-- CreateTable
CREATE TABLE `Model` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Model_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Field` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `type` VARCHAR(191) NOT NULL,
    `modelId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Field` ADD CONSTRAINT `Field_modelId_fkey` FOREIGN KEY (`modelId`) REFERENCES `Model`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
