/*
  Warnings:

  - You are about to alter the column `likes` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `disLikes` on the `Comment` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `disLikes` on the `Publish` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `likes` on the `Publish` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `likes` on the `SubComment` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `disLikes` on the `SubComment` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Comment" ALTER COLUMN "likes" SET DATA TYPE INTEGER,
ALTER COLUMN "disLikes" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "Publish" ALTER COLUMN "disLikes" SET DATA TYPE INTEGER,
ALTER COLUMN "likes" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "SubComment" ALTER COLUMN "likes" SET DATA TYPE INTEGER,
ALTER COLUMN "disLikes" SET DATA TYPE INTEGER;
