/*
  Warnings:

  - You are about to drop the column `trackingNumber` on the `courier` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[trackingNumber]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `courier` DROP COLUMN `trackingNumber`;

-- AlterTable
ALTER TABLE `order` ADD COLUMN `trackingNumber` VARCHAR(191) NULL,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_trackingNumber_key` ON `Order`(`trackingNumber`);
