-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Empty', 'Music', 'Movies', 'Entertainment', 'Sports', 'Food', 'Travel', 'Gaming', 'News', 'Animals', 'Education', 'Science', 'Technology', 'Programming', 'LifeStyle', 'Vehicles', 'Children', 'Women', 'Men', 'Other', 'NotExist');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "address" TEXT NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "accountId" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "handle" TEXT NOT NULL,
    "originalHandle" TEXT NOT NULL,
    "imageURI" TEXT,
    "default" BOOLEAN NOT NULL,

    CONSTRAINT "Profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Follow" (
    "id" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "owner" TEXT NOT NULL,
    "followerId" BIGINT NOT NULL,
    "followeeId" BIGINT NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Publish" (
    "id" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "owner" TEXT NOT NULL,
    "creatorId" BIGINT NOT NULL,
    "imageURI" TEXT NOT NULL,
    "contentURI" TEXT NOT NULL,
    "metadataURI" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "primaryCategory" "Category" NOT NULL,
    "secondaryCategory" "Category",
    "tertiaryCategory" "Category",
    "revenue" BIGINT NOT NULL,
    "disLikes" BIGINT NOT NULL,

    CONSTRAINT "Publish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "owner" TEXT NOT NULL,
    "creatorId" BIGINT NOT NULL,
    "targetId" BIGINT NOT NULL,
    "contentURI" TEXT NOT NULL,
    "likes" BIGINT NOT NULL,
    "disLikes" BIGINT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubComment" (
    "id" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "owner" TEXT NOT NULL,
    "creatorId" BIGINT NOT NULL,
    "targetId" BIGINT NOT NULL,
    "contentURI" TEXT NOT NULL,
    "likes" BIGINT NOT NULL,
    "disLikes" BIGINT NOT NULL,

    CONSTRAINT "SubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "profileId" BIGINT NOT NULL,
    "publishId" BIGINT NOT NULL,
    "fee" BIGINT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_address_key" ON "Account"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_handle_key" ON "Profile"("handle");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followeeId_fkey" FOREIGN KEY ("followeeId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publish" ADD CONSTRAINT "Publish_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Publish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubComment" ADD CONSTRAINT "SubComment_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubComment" ADD CONSTRAINT "SubComment_targetId_fkey" FOREIGN KEY ("targetId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_publishId_fkey" FOREIGN KEY ("publishId") REFERENCES "Publish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
