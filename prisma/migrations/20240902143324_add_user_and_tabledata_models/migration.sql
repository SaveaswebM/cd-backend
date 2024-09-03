/*
  Warnings:

  - The values [Paid] on the enum `SubscriptionType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `activityId` on the `TableData` table. All the data in the column will be lost.
  - You are about to drop the column `completed` on the `TableData` table. All the data in the column will be lost.
  - You are about to drop the column `completedBy` on the `TableData` table. All the data in the column will be lost.
  - You are about to drop the column `preferredDate` on the `TableData` table. All the data in the column will be lost.
  - You are about to drop the column `tableDataId` on the `User` table. All the data in the column will be lost.
  - Added the required column `data` to the `TableData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `selectedActivityType` to the `TableData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `TableData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionType_new" AS ENUM ('Free', 'Standard', 'Premium');
ALTER TABLE "User" ALTER COLUMN "subscriptionType" TYPE "SubscriptionType_new" USING ("subscriptionType"::text::"SubscriptionType_new");
ALTER TYPE "SubscriptionType" RENAME TO "SubscriptionType_old";
ALTER TYPE "SubscriptionType_new" RENAME TO "SubscriptionType";
DROP TYPE "SubscriptionType_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "TableData" DROP CONSTRAINT "TableData_activityId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tableDataId_fkey";

-- AlterTable
ALTER TABLE "TableData" DROP COLUMN "activityId",
DROP COLUMN "completed",
DROP COLUMN "completedBy",
DROP COLUMN "preferredDate",
ADD COLUMN     "activityName" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "data" TEXT NOT NULL,
ADD COLUMN     "key" TEXT,
ADD COLUMN     "month" "MonthType",
ADD COLUMN     "selectedActivityType" TEXT NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD COLUMN     "year" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "tableDataId",
ADD COLUMN     "otp" TEXT,
ADD COLUMN     "otpExpiration" TIMESTAMP(3),
ALTER COLUMN "name" DROP NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "TableData" ADD CONSTRAINT "TableData_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
