-- CreateTable
CREATE TABLE "DistToken" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "categoryId" TEXT,
    "folderId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DistToken_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DistToken_id_key" ON "DistToken"("id");

-- CreateIndex
CREATE UNIQUE INDEX "DistToken_token_key" ON "DistToken"("token");

-- AddForeignKey
ALTER TABLE "DistToken" ADD CONSTRAINT "DistToken_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistToken" ADD CONSTRAINT "DistToken_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "folder"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DistToken" ADD CONSTRAINT "DistToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
