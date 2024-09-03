/*
  Warnings:

  - You are about to drop the column `userId` on the `TableData` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "TableData" DROP CONSTRAINT "TableData_userId_fkey";

-- AlterTable
ALTER TABLE "TableData" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tableDataId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tableDataId_fkey" FOREIGN KEY ("tableDataId") REFERENCES "TableData"("id") ON DELETE SET NULL ON UPDATE CASCADE;
