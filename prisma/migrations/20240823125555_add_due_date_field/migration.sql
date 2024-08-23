/*
  Warnings:

  - You are about to drop the column `name` on the `ActivityData` table. All the data in the column will be lost.
  - You are about to drop the column `dueDate` on the `TableData` table. All the data in the column will be lost.
  - Added the required column `dueDate` to the `ActivityData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `quarterlyTypeId` to the `ActivityData` table without a default value. This is not possible if the table is not empty.
  - Added the required column `taskName` to the `ActivityData` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ActivityData" DROP COLUMN "name",
ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "quarterlyTypeId" INTEGER NOT NULL,
ADD COLUMN     "taskName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TableData" DROP COLUMN "dueDate";

-- CreateTable
CREATE TABLE "QuarterlyType" (
    "id" SERIAL NOT NULL,
    "startMonth" "MonthType" NOT NULL,
    "endMonth" "MonthType" NOT NULL,

    CONSTRAINT "QuarterlyType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ActivityData" ADD CONSTRAINT "ActivityData_quarterlyTypeId_fkey" FOREIGN KEY ("quarterlyTypeId") REFERENCES "QuarterlyType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
