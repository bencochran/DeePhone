-- CreateTable
CREATE TABLE "Episode" (
    "id" SERIAL NOT NULL,
    "guid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "contentURL" TEXT NOT NULL,
    "publishDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Episode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Episode_guid_key" ON "Episode"("guid");
