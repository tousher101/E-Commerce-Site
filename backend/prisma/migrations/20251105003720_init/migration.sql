-- AlterTable
ALTER TABLE `payment` MODIFY `status` ENUM('PAID', 'UNPAID', 'CANCELLED', 'FAILD') NOT NULL;
