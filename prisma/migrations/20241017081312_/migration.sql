/*
  Warnings:

  - You are about to drop the column `projectId` on the `Analytics` table. All the data in the column will be lost.
  - Added the required column `projectSecret` to the `Analytics` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Analytics" DROP CONSTRAINT "Analytics_projectId_fkey";

-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "projectId",
ADD COLUMN     "projectSecret" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_projectSecret_fkey" FOREIGN KEY ("projectSecret") REFERENCES "Project"("secret") ON DELETE RESTRICT ON UPDATE CASCADE;
