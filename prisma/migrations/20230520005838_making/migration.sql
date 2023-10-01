/*
  Warnings:

  - A unique constraint covering the columns `[nom]` on the table `Category` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `Category_nom_key` ON `Category`(`nom`);
