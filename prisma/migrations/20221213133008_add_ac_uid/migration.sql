/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `Account` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `type` to the `Account` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `Account` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('TRADITIONAL', 'WALLET');

-- AlterTable
ALTER TABLE "Account" ADD COLUMN     "type" "AccountType" NOT NULL,
ADD COLUMN     "uid" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Account_uid_key" ON "Account"("uid");
