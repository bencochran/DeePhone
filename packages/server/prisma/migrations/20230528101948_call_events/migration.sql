/*
  Warnings:

  - You are about to drop the column `currentPartId` on the `Call` table. All the data in the column will be lost.
  - You are about to drop the column `downloadId` on the `Call` table. All the data in the column will be lost.
  - You are about to drop the column `state` on the `Call` table. All the data in the column will be lost.
  - You are about to drop the column `waitingMessageCount` on the `Call` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_currentPartId_fkey";

-- DropForeignKey
ALTER TABLE "Call" DROP CONSTRAINT "Call_downloadId_fkey";

-- AlterTable
ALTER TABLE "Call" DROP COLUMN "currentPartId",
DROP COLUMN "downloadId",
DROP COLUMN "state",
DROP COLUMN "waitingMessageCount";

-- CreateTable
CREATE TABLE "CallEvent" (
    "id" SERIAL NOT NULL,
    "callId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "state" "CallState" NOT NULL,
    "waitingMessageCount" INTEGER NOT NULL DEFAULT 0,
    "downloadId" INTEGER,
    "currentPartId" INTEGER,

    CONSTRAINT "CallEvent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CallEvent" ADD CONSTRAINT "CallEvent_callId_fkey" FOREIGN KEY ("callId") REFERENCES "Call"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallEvent" ADD CONSTRAINT "CallEvent_downloadId_fkey" FOREIGN KEY ("downloadId") REFERENCES "EpisodeDownload"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CallEvent" ADD CONSTRAINT "CallEvent_currentPartId_fkey" FOREIGN KEY ("currentPartId") REFERENCES "EpisodePart"("id") ON DELETE SET NULL ON UPDATE CASCADE;
