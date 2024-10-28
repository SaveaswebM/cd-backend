/*
  Warnings:

  - Added the required column `owner` to the `Link` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recievers` to the `Link` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "owner" TEXT NOT NULL,
ADD COLUMN     "recievers" JSONB NOT NULL;
