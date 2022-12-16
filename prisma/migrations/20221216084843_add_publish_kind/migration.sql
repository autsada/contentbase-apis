/*
  Warnings:

  - Added the required column `kind` to the `Publish` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "PublishKind" AS ENUM ('Video', 'Short', 'Audio', 'Blog', 'Post');

-- AlterTable
ALTER TABLE "Publish" ADD COLUMN     "kind" "PublishKind" NOT NULL;
