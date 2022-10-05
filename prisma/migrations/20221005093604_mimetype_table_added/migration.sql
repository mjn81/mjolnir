/*
  Warnings:

  - You are about to drop the column `mimeType` on the `file` table. All the data in the column will be lost.
  - Added the required column `mimetypeId` to the `file` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "file" DROP COLUMN "mimeType",
ADD COLUMN     "mimetypeId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "mime_type" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "extension" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mime_type_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "mime_type_id_key" ON "mime_type"("id");

-- CreateIndex
CREATE UNIQUE INDEX "mime_type_extension_key" ON "mime_type"("extension");

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_mimetypeId_fkey" FOREIGN KEY ("mimetypeId") REFERENCES "mime_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
