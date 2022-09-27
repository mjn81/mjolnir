/*
  Warnings:

  - You are about to drop the column `folderId` on the `dist_token` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Access" AS ENUM ('PUBLIC', 'PRIVATE');

-- DropForeignKey
ALTER TABLE "dist_token" DROP CONSTRAINT "dist_token_folderId_fkey";

-- AlterTable
ALTER TABLE "dist_token" DROP COLUMN "folderId";

-- CreateTable
CREATE TABLE "public_file" (
    "id" TEXT NOT NULL,
    "fileId" TEXT NOT NULL,
    "access" "Access" NOT NULL DEFAULT 'PRIVATE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "public_file_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "public_file_id_key" ON "public_file"("id");

-- CreateIndex
CREATE UNIQUE INDEX "public_file_fileId_key" ON "public_file"("fileId");

-- AddForeignKey
ALTER TABLE "public_file" ADD CONSTRAINT "public_file_fileId_fkey" FOREIGN KEY ("fileId") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
