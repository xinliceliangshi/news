-- CreateEnum
CREATE TYPE "VoteSide" AS ENUM ('A', 'B');

-- CreateTable
CREATE TABLE "Vote" (
    "id" SERIAL NOT NULL,
    "topicId" INTEGER NOT NULL,
    "userId" INTEGER,
    "side" "VoteSide" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Vote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Vote_topicId_idx" ON "Vote"("topicId");

-- CreateIndex
CREATE INDEX "Vote_userId_idx" ON "Vote"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Vote_topicId_userId_key" ON "Vote"("topicId", "userId");

-- AddForeignKey
ALTER TABLE "Vote"
ADD CONSTRAINT "Vote_topicId_fkey"
FOREIGN KEY ("topicId") REFERENCES "Topic"("id")
ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Vote"
ADD CONSTRAINT "Vote_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "User"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
