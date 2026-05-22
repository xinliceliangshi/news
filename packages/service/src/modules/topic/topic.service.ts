import { AppError } from "../../shared/http/app-error";
import { ensureString } from "../../shared/utils/string";
import { prisma } from "../../lib/prisma";
import { toTopic } from "./topic.mapper";
import { getTopicSideStats } from "./topic.side-stats";
import { parseTopicId } from "./topic.utils";
import type { CreateTopicBody } from "./topic.types";
type ListTopicOptions = {
  tag?: string;
  keyword?: string;
  limit?: number;
};

async function findTopicOrThrow(id: number) {
  const topic = await prisma.topic.findUnique({
    where: {
      id: parseTopicId(id),
    },
  });

  if (!topic) {
    throw new AppError("topic not found", 404);
  }

  return topic;
}

function normalizeTags(tags: unknown) {
  if (!Array.isArray(tags)) {
    return [];
  }

  return [
    ...new Set(
      tags
        .map((tag) => (typeof tag === "string" ? tag.trim() : ""))
        .filter(Boolean),
    ),
  ];
}

function readSideLabel(
  payload: CreateTopicBody,
  side: "A" | "B",
) {
  if (side === "A") {
    return (
      ensureString(payload.sideALabel) ||
      ensureString(payload.sideA?.label)
    );
  }

  return (
    ensureString(payload.sideBLabel) ||
    ensureString(payload.sideB?.label)
  );
}

export async function listTopics(options: ListTopicOptions = {}) {
  const tag = options.tag?.trim();
  const keyword = options.keyword?.trim();
  const limit = options.limit;

  const topics = await prisma.topic.findMany({
    where: {
      status: "PUBLISHED",
      ...(tag
        ? {
            tags: {
              has: tag,
            },
          }
        : {}),
      ...(keyword
        ? {
            OR: [
              {
                title: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: keyword,
                  mode: "insensitive",
                },
              },
              {
                tags: {
                  has: keyword,
                },
              },
            ],
          }
        : {}),
    },
    orderBy: [
      {
        hotScore: "desc",
      },
      {
        publishedAt: "desc",
      },
    ],
    ...(limit && limit > 0 ? { take: limit } : {}),
  });

  return topics.map(toTopic);
}

export async function getTopicById(id: number) {
  const topic = await findTopicOrThrow(id);
  const sideStats = await getTopicSideStats(topic.id);

  return {
    ...toTopic(topic),
    sideStats,
  };
}

export async function createTopic(payload: CreateTopicBody) {
  const title = ensureString(payload.title);
  const description = ensureString(payload.description);
  const sideALabel = readSideLabel(payload, "A");
  const sideBLabel = readSideLabel(payload, "B");
  const tags = normalizeTags(payload.tags);
  const hotScore =
    typeof payload.hotScore === "number" && Number.isFinite(payload.hotScore)
      ? Math.max(0, Math.trunc(payload.hotScore))
      : 0;

  if (!title || !description || !sideALabel || !sideBLabel) {
    throw new AppError(
      "title, description, sideA.label and sideB.label are required",
      400,
    );
  }

  const topic = await prisma.topic.create({
    data: {
      title,
      description,
      sideALabel,
      sideBLabel,
      tags,
      hotScore,
      status: "DRAFT",
      publishedAt: new Date(),
    },
  });

  return toTopic(topic);
}

export async function publishTopic(id: number) {
  const topic = await findTopicOrThrow(id);

  if (topic.status === "PUBLISHED") {
    throw new AppError("topic is already published", 409);
  }

  if (topic.status === "ARCHIVED") {
    throw new AppError("archived topics cannot be published", 400);
  }

  const updated = await prisma.topic.update({
    where: {
      id: topic.id,
    },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  return toTopic(updated);
}

export async function archiveTopic(id: number) {
  const topic = await findTopicOrThrow(id);

  if (topic.status === "ARCHIVED") {
    throw new AppError("topic is already archived", 409);
  }

  const updated = await prisma.topic.update({
    where: {
      id: topic.id,
    },
    data: {
      status: "ARCHIVED",
    },
  });

  return toTopic(updated);
}
