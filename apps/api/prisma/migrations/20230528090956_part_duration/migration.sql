-- AlterTable
ALTER TABLE "EpisodePart" ADD COLUMN     "duration" DOUBLE PRECISION NOT NULL DEFAULT 0;

ALTER TABLE "EpisodePart" ALTER COLUMN   "duration" DROP DEFAULT;
