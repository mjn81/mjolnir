/*
  Warnings:

  - You are about to alter the column `limit` on the `role` table. The data in that column could be lost. The data in that column will be cast from `Real` to `BigInt`.

*/
-- AlterTable
ALTER TABLE "role" ALTER COLUMN "limit" SET DEFAULT 500000,
ALTER COLUMN "limit" SET DATA TYPE BIGINT;

-- AlterTable
ALTER TABLE "usage" ALTER COLUMN "used" SET DATA TYPE BIGINT;
