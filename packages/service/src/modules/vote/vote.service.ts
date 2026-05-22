import { prisma } from "../../lib/prisma";
import { AppError } from "../../shared/http/app-error";
import { ensureString } from "../../shared/utils/string";
import { toTopic } from "../topic/topic.mapper";
import { getTopicSideStats } from "../topic/topic.side-stats";
import { parseTopicId } from "../topic/topic.utils";
import type { TopicSideKey } from "../topic/topic.types";
import type { VoteTopicBody, VoteTopicResult } from "./vote.types";

function parseOptionalUserId(userId: unknown) {
  if (userId == null) {
    return null;
  }

  if (typeof userId !== "number" || !Number.isInteger(userId) || userId <= 0) {
    throw new AppError("userId must be a positive integer", 400);
  }

  return userId;
}

export async function voteTopic(
  topicId: number,
  payload: VoteTopicBody,
): Promise<VoteTopicResult> {
  const side = ensureString(payload.side).toUpperCase();
  const userId = parseOptionalUserId(payload.userId);

  if (side !== "A" && side !== "B") {
    throw new AppError('side must be "A" or "B"', 400);
  }

  const topic = await prisma.topic.findUnique({
    where: {
      id: parseTopicId(topicId),
    },
  });

  if (!topic) {
    throw new AppError("topic not found", 404);
  }

  if (topic.status !== "PUBLISHED") {
    throw new AppError("only published topics can be voted on", 400);
  }

  if (userId !== null) {
    const existingVote = await prisma.vote.findUnique({
      where: {
        topicId_userId: {
          topicId: topic.id,
          userId,
        },
      },
    });

    if (existingVote) {
      throw new AppError("user has already voted on this topic", 409);
    }
  }

  const updated = await prisma.$transaction(async (tx) => {
    await tx.vote.create({
      data: {
        topicId: topic.id,
        userId,
        side: side as TopicSideKey,
      },
    });

    return tx.topic.update({
      where: {
        id: topic.id,
      },
      data: {
        voteCount: {
          increment: 1,
        },
        hotScore: {
          increment: 1,
        },
      },
    });
  });

  const sideStats = await getTopicSideStats(updated.id);

  return {
    topic: {
      ...toTopic(updated),
      sideStats,
    },
    side: side as TopicSideKey,
    voteCount: updated.voteCount,
    sideStats,
  };
}
