/*
  Warnings:

  - You are about to drop the column `feeId` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the `Fee` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[likeFeeId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `likeFeeId` to the `Like` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Fee" DROP CONSTRAINT "Fee_publishId_fkey";

-- DropForeignKey
ALTER TABLE "Fee" DROP CONSTRAINT "Fee_receiverId_fkey";

-- DropForeignKey
ALTER TABLE "Fee" DROP CONSTRAINT "Fee_senderId_fkey";

-- DropForeignKey
ALTER TABLE "Like" DROP CONSTRAINT "Like_feeId_fkey";

-- DropIndex
DROP INDEX "Like_feeId_key";

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "feeId",
ADD COLUMN     "likeFeeId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "Fee";

-- CreateTable
CREATE TABLE "LikeFee" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "senderId" INTEGER NOT NULL,
    "publishId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,
    "amount" TEXT NOT NULL,
    "fee" TEXT NOT NULL,

    CONSTRAINT "LikeFee_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Like_likeFeeId_key" ON "Like"("likeFeeId");

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_likeFeeId_fkey" FOREIGN KEY ("likeFeeId") REFERENCES "LikeFee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeFee" ADD CONSTRAINT "LikeFee_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeFee" ADD CONSTRAINT "LikeFee_publishId_fkey" FOREIGN KEY ("publishId") REFERENCES "Publish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeFee" ADD CONSTRAINT "LikeFee_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
