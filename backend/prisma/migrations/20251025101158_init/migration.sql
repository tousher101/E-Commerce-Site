/*
  Warnings:

  - Made the column `size` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `color` on table `product` required. This step will fail if there are existing NULL values in that column.
  - Made the column `variant` on table `product` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `product` MODIFY `size` JSON NOT NULL,
    MODIFY `color` JSON NOT NULL,
    MODIFY `variant` JSON NOT NULL;
