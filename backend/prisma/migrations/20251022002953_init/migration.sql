/*
  Warnings:

  - You are about to drop the column `country` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `address` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `order` table. All the data in the column will be lost.
  - You are about to drop the column `paymentmethod` on the `order` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[barcode]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `barangay` to the `Address` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `address` DROP COLUMN `country`,
    DROP COLUMN `state`,
    ADD COLUMN `barangay` VARCHAR(191) NOT NULL,
    MODIFY `city` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `order` DROP COLUMN `paymentStatus`,
    DROP COLUMN `paymentmethod`;

-- AlterTable
ALTER TABLE `product` ADD COLUMN `barcode` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Product_barcode_key` ON `Product`(`barcode`);
