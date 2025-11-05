/*
  Warnings:

  - The values [FAILD] on the enum `Payment_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `payment` MODIFY `status` ENUM('PAID', 'UNPAID', 'CANCELLED', 'FAILED') NOT NULL;
