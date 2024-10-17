/*
  Warnings:

  - You are about to drop the column `geoLocationId` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `ipLocationId` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the `GeoLocation` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `IpLocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Analytics" DROP CONSTRAINT "Analytics_geoLocationId_fkey";

-- DropForeignKey
ALTER TABLE "Analytics" DROP CONSTRAINT "Analytics_ipLocationId_fkey";

-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "geoLocationId",
DROP COLUMN "ipLocationId",
ADD COLUMN     "accuracy" DOUBLE PRECISION,
ADD COLUMN     "city" TEXT,
ADD COLUMN     "country" TEXT,
ADD COLUMN     "ip" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION,
ADD COLUMN     "region" TEXT,
ALTER COLUMN "timestamp" SET DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "GeoLocation";

-- DropTable
DROP TABLE "IpLocation";
