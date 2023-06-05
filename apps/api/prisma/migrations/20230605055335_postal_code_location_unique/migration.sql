/*
  Warnings:

  - A unique constraint covering the columns `[postalCode,country]` on the table `PostalCodeLocation` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostalCodeLocation_postalCode_country_key" ON "PostalCodeLocation"("postalCode", "country");
