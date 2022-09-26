-- CreateTable
CREATE TABLE "dist_route" (
    "id" TEXT NOT NULL,
    "route" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "dist_route_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "dist_route_id_key" ON "dist_route"("id");

-- CreateIndex
CREATE UNIQUE INDEX "dist_route_route_key" ON "dist_route"("route");

-- CreateIndex
CREATE UNIQUE INDEX "dist_route_userId_key" ON "dist_route"("userId");

-- AddForeignKey
ALTER TABLE "dist_route" ADD CONSTRAINT "dist_route_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
