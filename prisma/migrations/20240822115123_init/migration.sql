-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('Superadmin', 'Admin', 'User');

-- CreateEnum
CREATE TYPE "SubscriptionType" AS ENUM ('Paid', 'Free');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('Monthly', 'Quarterly', 'Yearly');

-- CreateEnum
CREATE TYPE "MonthType" AS ENUM ('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');

-- CreateTable
CREATE TABLE "Year" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "Year_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Activity" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityData" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ActivityType" NOT NULL,
    "yearId" INTEGER NOT NULL,
    "month" "MonthType" NOT NULL,
    "activityId" INTEGER NOT NULL,

    CONSTRAINT "ActivityData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TableData" (
    "id" SERIAL NOT NULL,
    "activityId" INTEGER NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,
    "completedBy" TEXT,
    "preferredDate" TIMESTAMP(3),

    CONSTRAINT "TableData_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "userType" "UserType" NOT NULL,
    "subscriptionType" "SubscriptionType" NOT NULL,
    "subscriptionAmount" INTEGER NOT NULL,
    "tableDataId" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" SERIAL NOT NULL,
    "link" TEXT NOT NULL,
    "linkownerName" TEXT NOT NULL,
    "linkreciever" TEXT NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Year_year_key" ON "Year"("year");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Link_link_key" ON "Link"("link");

-- AddForeignKey
ALTER TABLE "ActivityData" ADD CONSTRAINT "ActivityData_yearId_fkey" FOREIGN KEY ("yearId") REFERENCES "Year"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ActivityData" ADD CONSTRAINT "ActivityData_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "Activity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TableData" ADD CONSTRAINT "TableData_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "ActivityData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tableDataId_fkey" FOREIGN KEY ("tableDataId") REFERENCES "TableData"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
