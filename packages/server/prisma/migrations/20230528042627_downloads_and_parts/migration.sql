-- CreateTable
CREATE TABLE "EpisodeDownload" (
    "id" SERIAL NOT NULL,
    "episodeId" INTEGER NOT NULL,
    "contentURL" TEXT NOT NULL,
    "downloadDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EpisodeDownload_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EpisodePart" (
    "id" SERIAL NOT NULL,
    "downloadId" INTEGER NOT NULL,
    "sortOrder" INTEGER NOT NULL,
    "key" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "EpisodePart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EpisodeDownload" ADD CONSTRAINT "EpisodeDownload_episodeId_fkey" FOREIGN KEY ("episodeId") REFERENCES "Episode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EpisodePart" ADD CONSTRAINT "EpisodePart_downloadId_fkey" FOREIGN KEY ("downloadId") REFERENCES "EpisodeDownload"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
