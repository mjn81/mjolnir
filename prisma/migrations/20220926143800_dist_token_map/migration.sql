/*
  Warnings:

  - You are about to drop the `DistToken` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "DistToken" DROP CONSTRAINT "DistToken_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "DistToken" DROP CONSTRAINT "DistToken_folderId_fkey";

-- DropForeignKey
ALTER TABLE "DistToken" DROP CONSTRAINT "DistToken_userId_fkey";

-- DropTable
DROP TABLE "DistToken";

-- CreateTable
CREATE TABLE "dist_token" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "categoryId" TEXT,
    "folderId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "dist_token_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dist_token_id_key" ON "dist_token"("id");

-- CreateIndex
CREATE UNIQUE INDEX "dist_token_token_key" ON "dist_token"("token");

-- AddForeignKey
ALTER TABLE "dist_token" ADD CONSTRAINT "dist_token_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dist_token" ADD CONSTRAINT "dist_token_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dist_token" ADD CONSTRAINT "dist_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
