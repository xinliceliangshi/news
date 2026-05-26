export type TopicMoodId = 'ai-office' | 'cyber-net' | 'keyboard-war' | 'comment-zone'

export type TopicMoodMeta = {
  id: TopicMoodId
  label: string
  tagline: string
}

export const TOPIC_MOODS: TopicMoodMeta[] = [
  { id: 'ai-office', label: 'AI办公室', tagline: '算法在加班，人类在站队' },
  { id: 'cyber-net', label: '赛博互联网', tagline: '霓虹信息流，争议永不掉线' },
  { id: 'keyboard-war', label: '键盘战争', tagline: '红蓝阵营，隔着屏幕互怼' },
  { id: 'comment-zone', label: '评论区风格', tagline: '高赞在前，情绪拉满' }
]

const MOOD_BY_ID = Object.fromEntries(TOPIC_MOODS.map((mood) => [mood.id, mood])) as Record<
  TopicMoodId,
  TopicMoodMeta
>

const TAG_MOOD_RULES: { mood: TopicMoodId; keywords: string[] }[] = [
  { mood: 'ai-office', keywords: ['AI', 'ai', '科技', '算法', '办公', '职场'] },
  { mood: 'cyber-net', keywords: ['互联网', '赛博', '网络', '平台', '流量', '短视频', '二次元'] },
  { mood: 'keyboard-war', keywords: ['体育', '饭圈', '战争', '对抗', '法律', '营销'] },
  { mood: 'comment-zone', keywords: ['社会', '情感', '评论', '年轻人', '消费', '电影', '文化'] }
]

export function getTopicMoodMeta(id: TopicMoodId): TopicMoodMeta {
  return MOOD_BY_ID[id]
}

export function resolveTopicMood(tags: string[] = [], topicId = 0): TopicMoodId {
  const joined = tags.join(' ')

  for (const rule of TAG_MOOD_RULES) {
    if (rule.keywords.some((keyword) => joined.includes(keyword))) {
      return rule.mood
    }
  }

  const index = Math.abs(topicId) % TOPIC_MOODS.length
  return TOPIC_MOODS[index].id
}
