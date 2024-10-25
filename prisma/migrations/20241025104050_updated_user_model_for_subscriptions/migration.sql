/*
  Warnings:

  - The values [Standard,Premium] on the enum `SubscriptionType` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "SubscriptionType_new" AS ENUM ('Free', 'Professional_monthly', 'Professional_yearly', 'Premium_monthly', 'Premium_yearly');
ALTER TABLE "User" ALTER COLUMN "subscriptionType" TYPE "SubscriptionType_new" USING ("subscriptionType"::text::"SubscriptionType_new");
ALTER TYPE "SubscriptionType" RENAME TO "SubscriptionType_old";
ALTER TYPE "SubscriptionType_new" RENAME TO "SubscriptionType";
DROP TYPE "SubscriptionType_old";
COMMIT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "autoRenewal" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "cancellationReason" TEXT,
ADD COLUMN     "lastPaymentDate" TIMESTAMP(3),
ADD COLUMN     "subscriptionEndtDate" TIMESTAMP(3),
ADD COLUMN     "subscriptionStartDate" TIMESTAMP(3),
ADD COLUMN     "subscriptionStatus" TEXT,
ALTER COLUMN "subscriptionAmount" DROP NOT NULL;
