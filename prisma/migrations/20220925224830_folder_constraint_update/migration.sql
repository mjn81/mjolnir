-- DropForeignKey
ALTER TABLE "folder" DROP CONSTRAINT "folder_parentId_fkey";

-- DropForeignKey
ALTER TABLE "folder" DROP CONSTRAINT "folder_usersId_fkey";

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "folder" ADD CONSTRAINT "folder_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
