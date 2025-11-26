/*
  Warnings:

  - Added the required column `baseOriginalPrice` to the `Product` table without a default value. This is not possible if the table is not empty.
  - Added the required column `basePrice` to the `Product` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `product` ADD COLUMN `baseOriginalPrice` DOUBLE NOT NULL,
    ADD COLUMN `basePrice` DOUBLE NOT NULL;
