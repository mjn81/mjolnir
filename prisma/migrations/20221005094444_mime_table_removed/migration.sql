/*
  Warnings:

  - You are about to drop the column `mimetypeId` on the `file` table. All the data in the column will be lost.
  - You are about to drop the `mime_type` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `mimeType` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_mimetypeId_fkey";

-- AlterTable
ALTER TABLE "file" DROP COLUMN "mimetypeId",
ADD COLUMN     "mimeType" TEXT NOT NULL;

-- DropTable
DROP TABLE "mime_type";
