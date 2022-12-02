/*
  Warnings:

  - The `secondaryCategory` column on the `Publish` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tertiaryCategory` column on the `Publish` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `primaryCategory` on the `Publish` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Publish" DROP COLUMN "primaryCategory",
ADD COLUMN     "primaryCategory" INTEGER NOT NULL,
DROP COLUMN "secondaryCategory",
ADD COLUMN     "secondaryCategory" INTEGER,
DROP COLUMN "tertiaryCategory",
ADD COLUMN     "tertiaryCategory" INTEGER;

-- DropEnum
DROP TYPE "Category";
