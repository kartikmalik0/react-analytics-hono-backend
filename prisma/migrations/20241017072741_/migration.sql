/*
  Warnings:

  - You are about to drop the column `accuracy` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `city` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `country` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `ip` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `latitude` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `longitude` on the `Analytics` table. All the data in the column will be lost.
  - You are about to drop the column `region` on the `Analytics` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Analytics" DROP COLUMN "accuracy",
DROP COLUMN "city",
DROP COLUMN "country",
DROP COLUMN "ip",
DROP COLUMN "latitude",
DROP COLUMN "longitude",
DROP COLUMN "region",
ADD COLUMN     "geoLocationId" TEXT,
ADD COLUMN     "ipLocationId" TEXT,
ALTER COLUMN "timestamp" DROP DEFAULT;

-- CreateTable
CREATE TABLE "GeoLocation" (
    "id" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "GeoLocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IpLocation" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "IpLocation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_geoLocationId_fkey" FOREIGN KEY ("geoLocationId") REFERENCES "GeoLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Analytics" ADD CONSTRAINT "Analytics_ipLocationId_fkey" FOREIGN KEY ("ipLocationId") REFERENCES "IpLocation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
