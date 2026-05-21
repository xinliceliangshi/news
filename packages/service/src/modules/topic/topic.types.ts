export type TopicSideKey = "A" | "B";

export type TopicSide = {
  key: TopicSideKey;
  label: string;
};

export type TopicStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type Topic = {
  id: number;
  title: string;
  description: string;
  sideA: TopicSide;
  sideB: TopicSide;
  tags: string[];
  hotScore: number;
  voteCount: number;
  status: TopicStatus;
  publishedAt: string;
};

export type CreateTopicBody = {
  title?: string;
  description?: string;
  sideALabel?: string;
  sideBLabel?: string;
  sideA?: {
    label?: string;
  };
  sideB?: {
    label?: string;
  };
  tags?: string[];
  hotScore?: number;
};
