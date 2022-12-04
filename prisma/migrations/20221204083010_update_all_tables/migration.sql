/*
  Warnings:

  - You are about to drop the column `disLikes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `targetId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `fee` on the `Like` table. All the data in the column will be lost.
  - You are about to drop the column `revenue` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `disLikes` on the `Publish` table. All the data in the column will be lost.
  - You are about to drop the column `likes` on the `Publish` table. All the data in the column will be lost.
  - You are about to drop the column `revenue` on the `Publish` table. All the data in the column will be lost.
  - The `secondaryCategory` column on the `Publish` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tertiaryCategory` column on the `Publish` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `SubComment` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[feeId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commentType` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publishId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `feeId` to the `Like` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `primaryCategory` on the `Publish` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Empty', 'Music', 'Movies', 'Entertainment', 'Sports', 'Food', 'Travel', 'Gaming', 'News', 'Animals', 'Education', 'Science', 'Technology', 'Programming', 'LifeStyle', 'Vehicles', 'Children', 'Women', 'Men', 'Other', 'NotExist');

-- CreateEnum
CREATE TYPE "CommentType" AS ENUM ('PUBLISH', 'COMMENT');

-- DropForeignKey
ALTER TABLE "Comment" DROP CONSTRAINT "Comment_targetId_fkey";

-- DropForeignKey
ALTER TABLE "SubComment" DROP CONSTRAINT "SubComment_creatorId_fkey";

-- DropForeignKey
ALTER TABLE "SubComment" DROP CONSTRAINT "SubComment_targetId_fkey";

-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "disLikes",
DROP COLUMN "likes",
DROP COLUMN "targetId",
ADD COLUMN     "commentId" INTEGER,
ADD COLUMN     "commentType" "CommentType" NOT NULL,
ADD COLUMN     "publishId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Like" DROP COLUMN "fee",
ADD COLUMN     "feeId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "revenue";

-- AlterTable
ALTER TABLE "Publish" DROP COLUMN "disLikes",
DROP COLUMN "likes",
DROP COLUMN "revenue",
DROP COLUMN "primaryCategory",
ADD COLUMN     "primaryCategory" "Category" NOT NULL,
DROP COLUMN "secondaryCategory",
ADD COLUMN     "secondaryCategory" "Category",
DROP COLUMN "tertiaryCategory",
ADD COLUMN     "tertiaryCategory" "Category";

-- DropTable
DROP TABLE "SubComment";

-- CreateTable
CREATE TABLE "Fee" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "senderId" INTEGER NOT NULL,
    "publishId" INTEGER NOT NULL,
    "receiverId" INTEGER NOT NULL,

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DisLike" (
    "id" SERIAL NOT NULL,
    "publishId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL,

    CONSTRAINT "DisLike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommentLike" (
    "commentId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CommentDisLike" (
    "commentId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_commentId_profileId_key" ON "CommentLike"("commentId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentDisLike_commentId_profileId_key" ON "CommentDisLike"("commentId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_feeId_key" ON "Like"("feeId");

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_publishId_fkey" FOREIGN KEY ("publishId") REFERENCES "Publish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_feeId_fkey" FOREIGN KEY ("feeId") REFERENCES "Fee"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fee" ADD CONSTRAINT "Fee_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fee" ADD CONSTRAINT "Fee_publishId_fkey" FOREIGN KEY ("publishId") REFERENCES "Publish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Fee" ADD CONSTRAINT "Fee_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisLike" ADD CONSTRAINT "DisLike_publishId_fkey" FOREIGN KEY ("publishId") REFERENCES "Publish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisLike" ADD CONSTRAINT "DisLike_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDisLike" ADD CONSTRAINT "CommentDisLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
