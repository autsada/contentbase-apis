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
    "id" SERIAL NOT NULL,
    "tokenId" BIGINT NOT NULL,
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
    "tokenId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "followerId" INTEGER NOT NULL,
    "followeeId" INTEGER NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerId","followeeId")
);

-- CreateTable
CREATE TABLE "Publish" (
    "id" SERIAL NOT NULL,
    "tokenId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "owner" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
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
    "id" SERIAL NOT NULL,
    "tokenId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "owner" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "targetId" INTEGER NOT NULL,
    "contentURI" TEXT NOT NULL,
    "likes" BIGINT NOT NULL,
    "disLikes" BIGINT NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubComment" (
    "id" SERIAL NOT NULL,
    "tokenId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "owner" TEXT NOT NULL,
    "creatorId" INTEGER NOT NULL,
    "targetId" INTEGER NOT NULL,
    "contentURI" TEXT NOT NULL,
    "likes" BIGINT NOT NULL,
    "disLikes" BIGINT NOT NULL,

    CONSTRAINT "SubComment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "tokenId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "profileId" INTEGER NOT NULL,
    "publishId" INTEGER NOT NULL,
    "fee" BIGINT NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_address_key" ON "Account"("address");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_tokenId_key" ON "Profile"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Profile_handle_key" ON "Profile"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Follow_tokenId_key" ON "Follow"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Publish_tokenId_key" ON "Publish"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Comment_tokenId_key" ON "Comment"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "SubComment_tokenId_key" ON "SubComment"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_tokenId_key" ON "Like"("tokenId");

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
