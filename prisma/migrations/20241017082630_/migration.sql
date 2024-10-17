/*
  Warnings:

  - You are about to drop the column `projectSecret` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `secret` on the `Project` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `Analytics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Analytics" DROP CONSTRAINT "Analytics_projectSecret_fkey";

-- DropIndex
DROP INDEX "Project_secret_key";

-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "projectSecret",
ADD COLUMN     "projectId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Project" DROP COLUMN "secret";

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
