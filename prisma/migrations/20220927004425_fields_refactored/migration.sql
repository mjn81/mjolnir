/*
  Warnings:

  - You are about to drop the column `usersId` on the `category` table. All the data in the column will be lost.
  - You are about to drop the column `categoriesId` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `foldersId` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `file` table. All the data in the column will be lost.
  - You are about to drop the column `usersId` on the `folder` table. All the data in the column will be lost.
  - Added the required column `userId` to the `category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `file` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `folder` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `public_file` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_usersId_fkey";

-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_categoriesId_fkey";

-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_foldersId_fkey";

-- DropForeignKey
ALTER TABLE "file" DROP CONSTRAINT "file_usersId_fkey";

-- DropForeignKey
ALTER TABLE "folder" DROP CONSTRAINT "folder_usersId_fkey";

-- AlterTable
ALTER TABLE "category" DROP COLUMN "usersId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "file" DROP COLUMN "categoriesId",
DROP COLUMN "foldersId",
DROP COLUMN "usersId",
ADD COLUMN     "folderId" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "folder" DROP COLUMN "usersId",
ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public_file" ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "_CategoryToFile" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CategoryToFile_AB_unique" ON "_CategoryToFile"("A", "B");

-- CreateIndex
CREATE INDEX "_CategoryToFile_B_index" ON "_CategoryToFile"("B");

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "file" ADD CONSTRAINT "file_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public_file" ADD CONSTRAINT "public_file_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToFile" ADD CONSTRAINT "_CategoryToFile_A_fkey" FOREIGN KEY ("A") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CategoryToFile" ADD CONSTRAINT "_CategoryToFile_B_fkey" FOREIGN KEY ("B") REFERENCES "file"("id") ON DELETE CASCADE ON UPDATE CASCADE;
