/*
  Warnings:

  - A unique constraint covering the columns `[startDate,id]` on the table `Call` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `startDate` to the `Call` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Call" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3) NOT NULL DEFAULT 'epoch'::TIMESTAMP;

ALTER TABLE "Call" ALTER COLUMN   "startDate" DROP DEFAULT;

-- CreateIndex
CREATE UNIQUE INDEX "Call_startDate_id_key" ON "Call"("startDate", "id");
