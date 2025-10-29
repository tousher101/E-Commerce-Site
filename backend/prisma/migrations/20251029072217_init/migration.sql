/*
  Warnings:

  - A unique constraint covering the columns `[shippingRateId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `shippingRateId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `order` ADD COLUMN `shippingRateId` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Order_shippingRateId_key` ON `Order`(`shippingRateId`);

-- AddForeignKey
ALTER TABLE `Order` ADD CONSTRAINT `Order_shippingRateId_fkey` FOREIGN KEY (`shippingRateId`) REFERENCES `ShippingRate`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
