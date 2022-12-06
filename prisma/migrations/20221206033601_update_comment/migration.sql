/*
  Warnings:

  - You are about to drop the column `owner` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `owner` on the `Publish` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[profileId,publishId]` on the table `Like` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "owner",
ADD COLUMN     "mediaURI" TEXT,
ADD COLUMN     "text" TEXT;

-- AlterTable
ALTER TABLE "Publish" DROP COLUMN "owner";

-- CreateIndex
CREATE UNIQUE INDEX "Like_profileId_publishId_key" ON "Like"("profileId", "publishId");
