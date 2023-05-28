/*
  Warnings:

  - You are about to drop the column `waitingMessageCount` on the `CallEvent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CallEvent" DROP COLUMN "waitingMessageCount";
