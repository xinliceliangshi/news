export const PERSONA_CONFIGS = [
  {
    mbti: 'INTJ',
    label: '战略家',
    archetype: '冷静布局型',
    summary: '先拆结构再发言，习惯用全局视角压制情绪场。',
    recommendations: ['ENFP', 'ESFP', 'ISFJ']
  },
  {
    mbti: 'INTP',
    label: '分析师',
    archetype: '逻辑拆解型',
    summary: '会先怀疑问题本身，再决定要不要站进战场。',
    recommendations: ['ESFJ', 'ESTJ', 'ENFJ']
  },
  {
    mbti: 'ENTJ',
    label: '指挥官',
    archetype: '强势推进型',
    summary: '目标明确、语气果断，擅长把争论拉成攻防局。',
    recommendations: ['INFP', 'ISFP', 'ISFJ']
  },
  {
    mbti: 'ENTP',
    label: '辩手',
    archetype: '挑刺反转型',
    summary: '最爱从缝里找反例，越有争议越容易兴奋。',
    recommendations: ['ISTJ', 'ISFJ', 'INFJ']
  },
  {
    mbti: 'INFJ',
    label: '洞察者',
    archetype: '情绪洞察型',
    summary: '会先理解人为什么这样想，再决定要不要反击。',
    recommendations: ['ESTP', 'ENTP', 'ESTJ']
  },
  {
    mbti: 'INFP',
    label: '理想主义者',
    archetype: '价值守护型',
    summary: '对立场背后的价值观更敏感，不太愿意随波逐流。',
    recommendations: ['ENTJ', 'ESTJ', 'ESFJ']
  },
  {
    mbti: 'ENFJ',
    label: '引导者',
    archetype: '共情带队型',
    summary: '擅长把分散情绪收拢成一套更有号召力的话术。',
    recommendations: ['ISTP', 'INTP', 'ISTJ']
  },
  {
    mbti: 'ENFP',
    label: '点火者',
    archetype: '情绪感染型',
    summary: '表达热烈、节奏快，很会把围观者一起卷进来。',
    recommendations: ['INTJ', 'ISTJ', 'ISFJ']
  },
  {
    mbti: 'ISTJ',
    label: '执行者',
    archetype: '规则校准型',
    summary: '会拿事实、流程和边界来给争论降噪。',
    recommendations: ['ENFP', 'ENTP', 'ESFP']
  },
  {
    mbti: 'ISFJ',
    label: '守护者',
    archetype: '稳定兜底型',
    summary: '更在意关系和秩序，不喜欢无意义的情绪消耗。',
    recommendations: ['ENTP', 'ESTP', 'INTJ']
  },
  {
    mbti: 'ESTJ',
    label: '裁决者',
    archetype: '秩序推进型',
    summary: '看不惯拖泥带水，容易把讨论推向结论和表态。',
    recommendations: ['INFP', 'ISFP', 'INTP']
  },
  {
    mbti: 'ESFJ',
    label: '协调者',
    archetype: '场面管理型',
    summary: '会顾全氛围与立场联盟，擅长维持阵营一致感。',
    recommendations: ['INTP', 'ISTP', 'INTJ']
  },
  {
    mbti: 'ISTP',
    label: '实干派',
    archetype: '问题直切型',
    summary: '不爱铺垫，通常一句话就会把争议切到核心。',
    recommendations: ['ENFJ', 'ESFJ', 'INFJ']
  },
  {
    mbti: 'ISFP',
    label: '感受派',
    archetype: '直觉表达型',
    summary: '更相信真实感受，站队时往往很看重立场共鸣。',
    recommendations: ['ENTJ', 'ESTJ', 'ENFJ']
  },
  {
    mbti: 'ESTP',
    label: '快攻手',
    archetype: '现场博弈型',
    summary: '反应快、出手猛，喜欢在即时对线里拿主动权。',
    recommendations: ['INFJ', 'ISFJ', 'INFP']
  },
  {
    mbti: 'ESFP',
    label: '气氛手',
    archetype: '情绪带动型',
    summary: '表达有感染力，容易把一场讨论变成大型现场。',
    recommendations: ['INTJ', 'ISTJ', 'INFJ']
  }
] as const

export type MbtiType = (typeof PERSONA_CONFIGS)[number]['mbti']

export type PersonaConfig = (typeof PERSONA_CONFIGS)[number]

export const MBTI_TYPES = PERSONA_CONFIGS.map((config) => config.mbti) as MbtiType[]

export const PERSONA_CONFIG_MAP: Record<MbtiType, PersonaConfig> = PERSONA_CONFIGS.reduce(
  (accumulator, config) => {
    accumulator[config.mbti] = config
    return accumulator
  },
  {} as Record<MbtiType, PersonaConfig>
)

export function getPersonaConfig(mbti: MbtiType) {
  return PERSONA_CONFIG_MAP[mbti]
}

export function getRecommendedPersonaTypes(mbti: MbtiType) {
  return [...PERSONA_CONFIG_MAP[mbti].recommendations]
}
