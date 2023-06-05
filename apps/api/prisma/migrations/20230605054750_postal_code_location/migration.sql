-- CreateTable
CREATE TABLE "PostalCodeLocation" (
    "id" SERIAL NOT NULL,
    "postalCode" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "fetchDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostalCodeLocation_pkey" PRIMARY KEY ("id")
);
