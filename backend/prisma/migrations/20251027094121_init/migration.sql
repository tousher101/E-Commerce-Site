/*
  Warnings:

  - You are about to drop the column `line2` on the `address` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `address` DROP COLUMN `line2`,
    ADD COLUMN `province` VARCHAR(191) NULL;
