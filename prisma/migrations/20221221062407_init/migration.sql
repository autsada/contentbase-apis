-- CreateEnum
CREATE TYPE "AccountType" AS ENUM ('TRADITIONAL', 'WALLET');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('Empty', 'Music', 'Movies', 'Entertainment', 'Sports', 'Food', 'Travel', 'Gaming', 'News', 'Animals', 'Education', 'Science', 'Technology', 'Programming', 'LifeStyle', 'Vehicles', 'Children', 'Women', 'Men', 'Other', 'NotExist');

-- CreateEnum
CREATE TYPE "PublishKind" AS ENUM ('Video', 'Short', 'Audio', 'Blog', 'Post');

-- CreateEnum
CREATE TYPE "CommentType" AS ENUM ('PUBLISH', 'COMMENT');

-- CreateTable
CREATE TABLE "Account" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "address" TEXT NOT NULL,
    "uid" TEXT,
    "type" "AccountType",

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Profile" (
    "id" SERIAL NOT NULL,
    "tokenId" TEXT NOT NULL,
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
    "tokenId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "followerId" INTEGER NOT NULL,
    "followeeId" INTEGER NOT NULL,

    CONSTRAINT "Follow_pkey" PRIMARY KEY ("followerId","followeeId")
);

-- CreateTable
CREATE TABLE "Publish" (
    "id" SERIAL NOT NULL,
    "tokenId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "creatorId" INTEGER NOT NULL,
    "creatorTokenId" TEXT NOT NULL,
    "contentURI" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "views" INTEGER NOT NULL,
    "primaryCategory" "Category" NOT NULL,
    "secondaryCategory" "Category" NOT NULL,
    "tertiaryCategory" "Category" NOT NULL,
    "kind" "PublishKind" NOT NULL,
    "thumbnailURL" TEXT,
    "url" TEXT,

    CONSTRAINT "Publish_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "tokenId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3),
    "creatorId" INTEGER NOT NULL,
    "publishId" INTEGER NOT NULL,
    "commentId" INTEGER,
    "text" TEXT NOT NULL,
    "commentType" "CommentType" NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Like" (
    "id" SERIAL NOT NULL,
    "tokenId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "profileId" INTEGER NOT NULL,
    "publishId" INTEGER NOT NULL,
    "likeFeeId" INTEGER NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "DisLike" (
    "createdAt" TIMESTAMP(3) NOT NULL,
    "publishId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CommentLike" (
    "createdAt" TIMESTAMP(3) NOT NULL,
    "commentId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "CommentDisLike" (
    "createdAt" TIMESTAMP(3) NOT NULL,
    "commentId" INTEGER NOT NULL,
    "profileId" INTEGER NOT NULL
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
CREATE UNIQUE INDEX "Like_tokenId_key" ON "Like"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_likeFeeId_key" ON "Like"("likeFeeId");

-- CreateIndex
CREATE UNIQUE INDEX "Like_profileId_publishId_key" ON "Like"("profileId", "publishId");

-- CreateIndex
CREATE UNIQUE INDEX "DisLike_publishId_profileId_key" ON "DisLike"("publishId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentLike_commentId_profileId_key" ON "CommentLike"("commentId", "profileId");

-- CreateIndex
CREATE UNIQUE INDEX "CommentDisLike_commentId_profileId_key" ON "CommentDisLike"("commentId", "profileId");

-- AddForeignKey
ALTER TABLE "Profile" ADD CONSTRAINT "Profile_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Follow" ADD CONSTRAINT "Follow_followeeId_fkey" FOREIGN KEY ("followeeId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Publish" ADD CONSTRAINT "Publish_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_publishId_fkey" FOREIGN KEY ("publishId") REFERENCES "Publish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_publishId_fkey" FOREIGN KEY ("publishId") REFERENCES "Publish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_likeFeeId_fkey" FOREIGN KEY ("likeFeeId") REFERENCES "LikeFee"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeFee" ADD CONSTRAINT "LikeFee_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeFee" ADD CONSTRAINT "LikeFee_publishId_fkey" FOREIGN KEY ("publishId") REFERENCES "Publish"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LikeFee" ADD CONSTRAINT "LikeFee_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisLike" ADD CONSTRAINT "DisLike_publishId_fkey" FOREIGN KEY ("publishId") REFERENCES "Publish"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DisLike" ADD CONSTRAINT "DisLike_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentLike" ADD CONSTRAINT "CommentLike_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CommentDisLike" ADD CONSTRAINT "CommentDisLike_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "Comment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
