-- DropForeignKey
ALTER TABLE "category" DROP CONSTRAINT "category_usersId_fkey";

-- AddForeignKey
ALTER TABLE "category" ADD CONSTRAINT "category_usersId_fkey" FOREIGN KEY ("usersId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
