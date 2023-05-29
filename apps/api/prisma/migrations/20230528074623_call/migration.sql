-- CreateEnum
CREATE TYPE "CallState" AS ENUM ('FETCHING_EPISODE', 'NO_EPISODE', 'EPISODE_ERROR', 'INTRODUCING_EPISODE', 'PLAYING_EPISODE', 'ENDING_EPISODE', 'ENDED');

-- CreateTable
CREATE TABLE "Call" (
    "id" SERIAL NOT NULL,
    "twilioCallSid" TEXT NOT NULL,
    "state" "CallState" NOT NULL,
    "waitingMessageCount" INTEGER NOT NULL DEFAULT 0,
    "downloadId" INTEGER,
    "currentPartId" INTEGER,
    "phoneNumber" TEXT NOT NULL,
    "callerName" TEXT,
    "callerCity" TEXT,
    "callerState" TEXT,
    "callerZip" TEXT,
    "callerCountry" TEXT,
    "callDuration" INTEGER,

    CONSTRAINT "Call_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Call_twilioCallSid_key" ON "Call"("twilioCallSid");

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_downloadId_fkey" FOREIGN KEY ("downloadId") REFERENCES "EpisodeDownload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Call" ADD CONSTRAINT "Call_currentPartId_fkey" FOREIGN KEY ("currentPartId") REFERENCES "EpisodePart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
