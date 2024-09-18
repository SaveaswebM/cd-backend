/*
  Warnings:

  - You are about to drop the column `activities` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `companyName` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `linkownerName` on the `Link` table. All the data in the column will be lost.
  - You are about to drop the column `linkrecieverName` on the `Link` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Link" DROP COLUMN "activities",
DROP COLUMN "companyName",
DROP COLUMN "linkownerName",
DROP COLUMN "linkrecieverName";
