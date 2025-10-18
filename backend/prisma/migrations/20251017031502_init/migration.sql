/*
  Warnings:

  - You are about to drop the column `total` on the `order` table. All the data in the column will be lost.
  - The values [PAID] on the enum `Order_status` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `price` on the `orderitem` table. All the data in the column will be lost.
  - You are about to alter the column `status` on the `payment` table. The data in that column could be lost. The data in that column will be cast from `Enum(EnumId(0))` to `Enum(EnumId(6))`.
  - You are about to drop the `_addresstoorder` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[referralCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `status` to the `Cart` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `CartItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `addressId` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentStatus` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentmethod` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unitPrice` to the `OrderItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `paymentmethod` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weight` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `referralCode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `_addresstoorder` DROP FOREIGN KEY `_AddressToOrder_A_fkey`;

-- DropForeignKey
ALTER TABLE `_addresstoorder` DROP FOREIGN KEY `_AddressToOrder_B_fkey`;

-- AlterTable
ALTER TABLE `cart` ADD COLUMN `status` ENUM('PENDING', 'COMPLETED') NOT NULL;

-- AlterTable
ALTER TABLE `cartitem` ADD COLUMN `totalPrice` DECIMAL(10, 2) NOT NULL,
    ADD COLUMN `varitan` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `total`,
    ADD COLUMN `addressId` INTEGER NOT NULL,
    ADD COLUMN `paymentStatus` ENUM('PAID', 'UNPAID', 'CANCELLED') NOT NULL,
    ADD COLUMN `paymentmethod` ENUM('COD', 'CARD') NOT NULL,
    ADD COLUMN `totalPrice` DOUBLE NOT NULL,
    MODIFY `status` ENUM('PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE `orderitem` DROP COLUMN `price`,
    ADD COLUMN `totalPrice` DOUBLE NOT NULL,
    ADD COLUMN `unitPrice` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `payment` ADD COLUMN `paymentmethod` ENUM('COD', 'CARD') NOT NULL,
    MODIFY `status` ENUM('PAID', 'UNPAID', 'CANCELLED') NOT NULL;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `variant` VARCHAR(191) NULL,
    ADD COLUMN `weight` DOUBLE NOT NULL;

-- AlterTable
ALTER TABLE `user` ADD COLUMN `referralCode` VARCHAR(191) NOT NULL,
    ADD COLUMN `referredBy` VARCHAR(191) NULL;

-- DropTable
DROP TABLE `_addresstoorder`;

-- CreateTable
CREATE TABLE `RefWallet` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `amount` DOUBLE NOT NULL,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `RefWallet_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ShippingRate` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `location` VARCHAR(191) NOT NULL,
    `baseFee` DOUBLE NOT NULL,
    `perKgFee` DOUBLE NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Comment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `comment` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `productId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `User_referralCode_key` ON `User`(`referralCode`);

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_referredBy_fkey` FOREIGN KEY (`referredBy`) REFERENCES `User`(`referralCode`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `RefWallet` ADD CONSTRAINT `RefWallet_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_addressId_fkey` FOREIGN KEY (`addressId`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_productId_fkey` FOREIGN KEY (`productId`) REFERENCES `Product`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
