-- DropForeignKey
ALTER TABLE "usage" DROP CONSTRAINT "usage_userId_fkey";

-- AddForeignKey
ALTER TABLE "usage" ADD CONSTRAINT "usage_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
