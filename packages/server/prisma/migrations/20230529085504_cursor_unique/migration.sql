/*
  Warnings:

  - A unique constraint covering the columns `[date,id]` on the table `CallEvent` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[publishDate,id]` on the table `Episode` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[downloadDate,id]` on the table `EpisodeDownload` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[sortOrder,downloadId]` on the table `EpisodePart` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[title,id]` on the table `Podcast` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CallEvent_date_id_key" ON "CallEvent"("date", "id");

-- CreateIndex
CREATE UNIQUE INDEX "Episode_publishDate_id_key" ON "Episode"("publishDate", "id");

-- CreateIndex
CREATE UNIQUE INDEX "EpisodeDownload_downloadDate_id_key" ON "EpisodeDownload"("downloadDate", "id");

-- CreateIndex
CREATE UNIQUE INDEX "EpisodePart_sortOrder_downloadId_key" ON "EpisodePart"("sortOrder", "downloadId");

-- CreateIndex
CREATE UNIQUE INDEX "Podcast_title_id_key" ON "Podcast"("title", "id");
