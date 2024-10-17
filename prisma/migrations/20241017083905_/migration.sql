/*
  Warnings:

  - You are about to drop the column `city` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `Analytics` table. All the data in the column will be lost.
  - The `referrer` column on the `Analytics` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[projectId]` on the table `Analytics` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "region",
ADD COLUMN     "cities" TEXT[],
ADD COLUMN     "countries" TEXT[],
ADD COLUMN     "regions" TEXT[],
ADD COLUMN     "views" INTEGER NOT NULL DEFAULT 0,
DROP COLUMN "referrer",
ADD COLUMN     "referrer" TEXT[];

-- CreateIndex
CREATE UNIQUE INDEX "Analytics_projectId_key" ON "Analytics"("projectId");
