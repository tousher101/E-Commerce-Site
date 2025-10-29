/*
  Warnings:

  - You are about to drop the column `varitan` on the `cartitem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `cartitem` DROP COLUMN `varitan`,
    ADD COLUMN `variant` VARCHAR(191) NULL;
