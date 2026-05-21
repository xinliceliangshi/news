import type { Topic, TopicSideKey } from "../topic/topic.types";

export type VoteTopicBody = {
  side?: string;
  userId?: number;
};

export type VoteTopicResult = {
  topic: Topic;
  side: TopicSideKey;
  voteCount: number;
};
