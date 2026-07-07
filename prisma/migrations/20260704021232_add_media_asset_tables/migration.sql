-- CreateTable
CREATE TABLE `MediaAsset` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `publicId` VARCHAR(191) NOT NULL,
    `resourceType` ENUM('IMAGE', 'VIDEO', 'RAW') NOT NULL,
    `format` VARCHAR(191) NULL,
    `version` VARCHAR(191) NULL,
    `uploadStatus` ENUM('PENDING', 'ACTIVE') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `MediaAsset_publicId_key`(`publicId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `BookMediaAsset` (
    `bookId` INTEGER NOT NULL,
    `mediaAssetId` INTEGER NOT NULL,
    `order` INTEGER NOT NULL,

    UNIQUE INDEX `BookMediaAsset_bookId_order_key`(`bookId`, `order`),
    PRIMARY KEY (`bookId`, `mediaAssetId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `BookMediaAsset` ADD CONSTRAINT `BookMediaAsset_bookId_fkey` FOREIGN KEY (`bookId`) REFERENCES `Book`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `BookMediaAsset` ADD CONSTRAINT `BookMediaAsset_mediaAssetId_fkey` FOREIGN KEY (`mediaAssetId`) REFERENCES `MediaAsset`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
