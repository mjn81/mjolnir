/*
  Warnings:

  - You are about to drop the `public_file` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public_file" DROP CONSTRAINT "public_file_fileId_fkey";

-- DropForeignKey
ALTER TABLE "public_file" DROP CONSTRAINT "public_file_userId_fkey";

-- AlterTable
ALTER TABLE "file" ADD COLUMN     "access" "Access" NOT NULL DEFAULT 'PRIVATE';

-- DropTable
DROP TABLE "public_file";
