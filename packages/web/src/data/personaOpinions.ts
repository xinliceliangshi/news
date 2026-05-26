import { PERSONA_CONFIGS } from '../constants/personas'
import type { MbtiType } from '../constants/mbti'

export const mbtiOpinionRecommendations: Record<MbtiType, MbtiType[]> = PERSONA_CONFIGS.reduce(
  (accumulator, config) => {
    accumulator[config.mbti] = [...config.recommendations]
    return accumulator
  },
  {} as Record<MbtiType, MbtiType[]>
)
