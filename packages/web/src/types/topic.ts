export type TopicSideKey = 'A' | 'B'

export type TopicSide = {
  key: TopicSideKey
  label: string
}

export type TopicStatus = 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'

export type TopicSideStats = {
  sideA: { count: number; percent: number }
  sideB: { count: number; percent: number }
}

export type Topic = {
  id: number
  title: string
  description: string
  sideA: TopicSide
  sideB: TopicSide
  tags: string[]
  hotScore: number
  voteCount: number
  sideStats?: TopicSideStats
  status: TopicStatus
  publishedAt: string
}

export type VoteTopicPayload = {
  side: TopicSideKey
  userId?: number
}

export type VoteTopicResult = {
  topic: Topic
  side: TopicSideKey
  voteCount: number
  sideStats: TopicSideStats
}
