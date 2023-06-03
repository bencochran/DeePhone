-- AlterEnum
ALTER TYPE "CallState" RENAME TO "CallEventType";
ALTER TYPE "CallEventType" ADD VALUE 'ANSWERED' BEFORE 'FETCHING_EPISODE';
ALTER TYPE "CallEventType" ADD VALUE 'EPISODE_READY' BEFORE 'NO_EPISODE';
ALTER TYPE "CallEventType" ADD VALUE 'WAITING_MESSAGE' BEFORE 'INTRODUCING_EPISODE';

-- RenameForeignKey
ALTER TABLE "CallEvent" RENAME COLUMN "state" TO "type";

-- AlterTable
ALTER TABLE "CallEvent" RENAME COLUMN "currentPartId" TO "partId";

-- RenameForeignKey
ALTER TABLE "CallEvent" RENAME CONSTRAINT "CallEvent_currentPartId_fkey" TO "CallEvent_partId_fkey";
