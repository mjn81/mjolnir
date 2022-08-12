-- DropForeignKey
ALTER TABLE "Files" DROP CONSTRAINT "Files_usersId_fkey";

-- AddForeignKey
ALTER TABLE "Files" ADD CONSTRAINT "Files_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
