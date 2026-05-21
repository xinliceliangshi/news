import type { Topic, TopicStatus } from "./topic.types";

export type TopicRecord = {
  id: number;
  title: string;
  description: string;
  sideALabel: string;
  sideBLabel: string;
  tags: string[];
  hotScore: number;
  voteCount: number;
  status: TopicStatus;
  publishedAt: Date;
};

export function toTopic(topic: TopicRecord): Topic {
  return {
    id: topic.id,
    title: topic.title,
    description: topic.description,
    sideA: {
      key: "A",
      label: topic.sideALabel,
    },
    sideB: {
      key: "B",
      label: topic.sideBLabel,
    },
    tags: topic.tags,
    hotScore: topic.hotScore,
    voteCount: topic.voteCount,
    status: topic.status,
    publishedAt: topic.publishedAt.toISOString(),
  };
}
