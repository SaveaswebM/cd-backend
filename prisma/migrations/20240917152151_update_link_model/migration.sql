/*
  Warnings:

  - You are about to drop the column `linkreciever` on the `Link` table. All the data in the column will be lost.
  - Added the required column `companyName` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `linkrecieverName` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `selectedActivityType` on the `TableData` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterEnum
ALTER TYPE "ActivityType" ADD VALUE 'admin';

-- AlterTable
ALTER TABLE "Link" DROP COLUMN "linkreciever",
ADD COLUMN     "activities" TEXT[],
ADD COLUMN     "companyName" TEXT NOT NULL,
ADD COLUMN     "linkrecieverName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TableData" DROP COLUMN "selectedActivityType",
ADD COLUMN     "selectedActivityType" "ActivityType" NOT NULL;
