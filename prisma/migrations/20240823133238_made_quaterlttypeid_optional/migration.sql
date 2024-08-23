-- DropForeignKey
ALTER TABLE "ActivityData" DROP CONSTRAINT "ActivityData_quarterlyTypeId_fkey";

-- AlterTable
ALTER TABLE "ActivityData" ALTER COLUMN "quarterlyTypeId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "ActivityData" ADD CONSTRAINT "ActivityData_quarterlyTypeId_fkey" FOREIGN KEY ("quarterlyTypeId") REFERENCES "QuarterlyType"("id") ON DELETE SET NULL ON UPDATE CASCADE;
