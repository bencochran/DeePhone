/*
  Warnings:

  - A unique constraint covering the columns `[podcastId,guid]` on the table `Episode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `podcastId` to the `Episode` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Episode_guid_key";

-- AlterTable
ALTER TABLE "Episode" ADD COLUMN     "podcastId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "Podcast" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "feedURL" TEXT NOT NULL,
    "lastFetchDate" TIMESTAMP(3),

    CONSTRAINT "Podcast_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Episode_podcastId_guid_key" ON "Episode"("podcastId", "guid");

-- AddForeignKey
ALTER TABLE "Episode" ADD CONSTRAINT "Episode_podcastId_fkey" FOREIGN KEY ("podcastId") REFERENCES "Podcast"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
