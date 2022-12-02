/*
  Warnings:

  - Added the required column `revenue` to the `Profile` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Like" ALTER COLUMN "fee" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "revenue" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Publish" ALTER COLUMN "revenue" SET DATA TYPE TEXT;
