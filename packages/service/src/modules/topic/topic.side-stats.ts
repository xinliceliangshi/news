import { prisma } from "../../lib/prisma";

export type TopicSideStats = {
  sideA: { count: number; percent: number };
  sideB: { count: number; percent: number };
};

export async function getTopicSideStats(topicId: number): Promise<TopicSideStats> {
  const counts = await prisma.vote.groupBy({
    by: ["side"],
    where: { topicId },
    _count: { _all: true },
  });

  const sideACount = counts.find((row) => row.side === "A")?._count._all ?? 0;
  const sideBCount = counts.find((row) => row.side === "B")?._count._all ?? 0;
  const total = sideACount + sideBCount;

  if (total === 0) {
    return {
      sideA: { count: 0, percent: 50 },
      sideB: { count: 0, percent: 50 },
    };
  }

  const aPercent = Math.round((sideACount / total) * 100);

  return {
    sideA: { count: sideACount, percent: aPercent },
    sideB: { count: sideBCount, percent: 100 - aPercent },
  };
}
