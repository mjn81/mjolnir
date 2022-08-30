-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_foldersId_fkey";

-- AlterTable
ALTER TABLE "file" ALTER COLUMN "foldersId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_foldersId_fkey" FOREIGN KEY ("foldersId") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;
