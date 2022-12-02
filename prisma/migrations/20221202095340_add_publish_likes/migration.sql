/*
  Warnings:

  - Added the required column `likes` to the `Publish` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Publish" ADD COLUMN     "likes" BIGINT NOT NULL;
