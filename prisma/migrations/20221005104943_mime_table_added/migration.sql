/*
  Warnings:

  - You are about to drop the column `type` on the `file` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "file" DROP COLUMN "type",
ADD COLUMN     "typeId" TEXT;

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
ALTER TABLE "file" ADD CONSTRAINT "file_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "mime_type"("id") ON DELETE SET NULL ON UPDATE CASCADE;
