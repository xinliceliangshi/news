type PersonaPalette = {
  accent: string
  soft: string
  glow: string
  border: string
  text: string
}

export type PersonaConfig = {
  mbti: string
  label: string
  archetype: string
  summary: string
  recommendations: string[]
  palette: PersonaPalette
}

export const PERSONA_CONFIGS = [
  {
    mbti: 'INTJ',
    label: '战略家',
    archetype: '冷静布局型',
    summary: '先拆结构再发言，习惯用全局视角压制情绪场。',
    recommendations: ['ENFP', 'ESFP', 'ISFJ'],
    palette: {
      accent: '#7c8cff',
      soft: 'rgba(124, 140, 255, 0.16)',
      glow: 'rgba(124, 140, 255, 0.24)',
      border: 'rgba(124, 140, 255, 0.38)',
      text: '#d9e0ff'
    }
  },
  {
    mbti: 'INTP',
    label: '分析师',
    archetype: '逻辑拆解型',
    summary: '会先怀疑问题本身，再决定要不要站进战场。',
    recommendations: ['ESFJ', 'ESTJ', 'ENFJ'],
    palette: {
      accent: '#59c3ff',
      soft: 'rgba(89, 195, 255, 0.16)',
      glow: 'rgba(89, 195, 255, 0.24)',
      border: 'rgba(89, 195, 255, 0.36)',
      text: '#d5f3ff'
    }
  },
  {
    mbti: 'ENTJ',
    label: '指挥官',
    archetype: '强势推进型',
    summary: '目标明确、语气果断，擅长把争论拉成攻防局。',
    recommendations: ['INFP', 'ISFP', 'ISFJ'],
    palette: {
      accent: '#ff7a66',
      soft: 'rgba(255, 122, 102, 0.16)',
      glow: 'rgba(255, 122, 102, 0.24)',
      border: 'rgba(255, 122, 102, 0.38)',
      text: '#ffd8d0'
    }
  },
  {
    mbti: 'ENTP',
    label: '辩手',
    archetype: '挑刺反转型',
    summary: '最爱从缝里找反例，越有争议越容易兴奋。',
    recommendations: ['ISTJ', 'ISFJ', 'INFJ'],
    palette: {
      accent: '#ff9d3f',
      soft: 'rgba(255, 157, 63, 0.16)',
      glow: 'rgba(255, 157, 63, 0.24)',
      border: 'rgba(255, 157, 63, 0.38)',
      text: '#ffe0be'
    }
  },
  {
    mbti: 'INFJ',
    label: '洞察者',
    archetype: '情绪洞察型',
    summary: '会先理解人为什么这样想，再决定要不要反击。',
    recommendations: ['ESTP', 'ENTP', 'ESTJ'],
    palette: {
      accent: '#8f7cff',
      soft: 'rgba(143, 124, 255, 0.16)',
      glow: 'rgba(143, 124, 255, 0.24)',
      border: 'rgba(143, 124, 255, 0.36)',
      text: '#e0d9ff'
    }
  },
  {
    mbti: 'INFP',
    label: '理想主义者',
    archetype: '价值守护型',
    summary: '对立场背后的价值观更敏感，不太愿意随波逐流。',
    recommendations: ['ENTJ', 'ESTJ', 'ESFJ'],
    palette: {
      accent: '#ff7fcf',
      soft: 'rgba(255, 127, 207, 0.16)',
      glow: 'rgba(255, 127, 207, 0.24)',
      border: 'rgba(255, 127, 207, 0.36)',
      text: '#ffd7f1'
    }
  },
  {
    mbti: 'ENFJ',
    label: '引导者',
    archetype: '共情带队型',
    summary: '擅长把分散情绪收拢成一套更有号召力的话术。',
    recommendations: ['ISTP', 'INTP', 'ISTJ'],
    palette: {
      accent: '#34d399',
      soft: 'rgba(52, 211, 153, 0.16)',
      glow: 'rgba(52, 211, 153, 0.24)',
      border: 'rgba(52, 211, 153, 0.36)',
      text: '#d0ffec'
    }
  },
  {
    mbti: 'ENFP',
    label: '点火者',
    archetype: '情绪感染型',
    summary: '表达热烈、节奏快，很会把围观者一起卷进来。',
    recommendations: ['INTJ', 'ISTJ', 'ISFJ'],
    palette: {
      accent: '#ff6da8',
      soft: 'rgba(255, 109, 168, 0.16)',
      glow: 'rgba(255, 109, 168, 0.24)',
      border: 'rgba(255, 109, 168, 0.36)',
      text: '#ffd7e8'
    }
  },
  {
    mbti: 'ISTJ',
    label: '执行者',
    archetype: '规则校准型',
    summary: '会拿事实、流程和边界来给争论降噪。',
    recommendations: ['ENFP', 'ENTP', 'ESFP'],
    palette: {
      accent: '#94a3b8',
      soft: 'rgba(148, 163, 184, 0.16)',
      glow: 'rgba(148, 163, 184, 0.22)',
      border: 'rgba(148, 163, 184, 0.34)',
      text: '#e2e8f0'
    }
  },
  {
    mbti: 'ISFJ',
    label: '守护者',
    archetype: '稳定兜底型',
    summary: '更在意关系和秩序，不喜欢无意义的情绪消耗。',
    recommendations: ['ENTP', 'ESTP', 'INTJ'],
    palette: {
      accent: '#60a5fa',
      soft: 'rgba(96, 165, 250, 0.16)',
      glow: 'rgba(96, 165, 250, 0.22)',
      border: 'rgba(96, 165, 250, 0.34)',
      text: '#dbeafe'
    }
  },
  {
    mbti: 'ESTJ',
    label: '裁决者',
    archetype: '秩序推进型',
    summary: '看不惯拖泥带水，容易把讨论推向结论和表态。',
    recommendations: ['INFP', 'ISFP', 'INTP'],
    palette: {
      accent: '#f97316',
      soft: 'rgba(249, 115, 22, 0.16)',
      glow: 'rgba(249, 115, 22, 0.22)',
      border: 'rgba(249, 115, 22, 0.34)',
      text: '#ffdfc7'
    }
  },
  {
    mbti: 'ESFJ',
    label: '协调者',
    archetype: '场面管理型',
    summary: '会顾全氛围与立场联盟，擅长维持阵营一致感。',
    recommendations: ['INTP', 'ISTP', 'INTJ'],
    palette: {
      accent: '#fb7185',
      soft: 'rgba(251, 113, 133, 0.16)',
      glow: 'rgba(251, 113, 133, 0.22)',
      border: 'rgba(251, 113, 133, 0.34)',
      text: '#ffe0e6'
    }
  },
  {
    mbti: 'ISTP',
    label: '实干派',
    archetype: '问题直切型',
    summary: '不爱铺垫，通常一句话就会把争议切到核心。',
    recommendations: ['ENFJ', 'ESFJ', 'INFJ'],
    palette: {
      accent: '#22c55e',
      soft: 'rgba(34, 197, 94, 0.16)',
      glow: 'rgba(34, 197, 94, 0.22)',
      border: 'rgba(34, 197, 94, 0.34)',
      text: '#d9ffe7'
    }
  },
  {
    mbti: 'ISFP',
    label: '感受派',
    archetype: '直觉表达型',
    summary: '更相信真实感受，站队时往往很看重立场共鸣。',
    recommendations: ['ENTJ', 'ESTJ', 'ENFJ'],
    palette: {
      accent: '#a78bfa',
      soft: 'rgba(167, 139, 250, 0.16)',
      glow: 'rgba(167, 139, 250, 0.22)',
      border: 'rgba(167, 139, 250, 0.34)',
      text: '#efe7ff'
    }
  },
  {
    mbti: 'ESTP',
    label: '快攻手',
    archetype: '现场博弈型',
    summary: '反应快、出手猛，喜欢在即时对线里拿主动权。',
    recommendations: ['INFJ', 'ISFJ', 'INFP'],
    palette: {
      accent: '#14b8a6',
      soft: 'rgba(20, 184, 166, 0.16)',
      glow: 'rgba(20, 184, 166, 0.22)',
      border: 'rgba(20, 184, 166, 0.34)',
      text: '#d2fff8'
    }
  },
  {
    mbti: 'ESFP',
    label: '气氛手',
    archetype: '情绪带动型',
    summary: '表达有感染力，容易把一场讨论变成大型现场。',
    recommendations: ['INTJ', 'ISTJ', 'INFJ'],
    palette: {
      accent: '#facc15',
      soft: 'rgba(250, 204, 21, 0.16)',
      glow: 'rgba(250, 204, 21, 0.22)',
      border: 'rgba(250, 204, 21, 0.34)',
      text: '#fff3bf'
    }
  }
] as const satisfies readonly PersonaConfig[]

export type MbtiType = (typeof PERSONA_CONFIGS)[number]['mbti']

export const MBTI_TYPES = PERSONA_CONFIGS.map((config) => config.mbti) as MbtiType[]

export const PERSONA_CONFIG_MAP: Record<MbtiType, (typeof PERSONA_CONFIGS)[number]> =
  PERSONA_CONFIGS.reduce(
    (accumulator, config) => {
      accumulator[config.mbti] = config
      return accumulator
    },
    {} as Record<MbtiType, (typeof PERSONA_CONFIGS)[number]>
  )

export function getPersonaConfig(mbti: MbtiType) {
  return PERSONA_CONFIG_MAP[mbti]
}

export function getRecommendedPersonaTypes(mbti: MbtiType) {
  return [...PERSONA_CONFIG_MAP[mbti].recommendations] as MbtiType[]
}

export function getPersonaThemeStyle(mbti: MbtiType) {
  const persona = getPersonaConfig(mbti)

  return {
    '--persona-accent': persona.palette.accent,
    '--persona-soft': persona.palette.soft,
    '--persona-glow': persona.palette.glow,
    '--persona-border': persona.palette.border,
    '--persona-text': persona.palette.text
  }
}
