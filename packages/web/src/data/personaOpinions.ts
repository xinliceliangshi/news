import type { MbtiType } from '../constants/mbti'

export const mbtiOpinionRecommendations: Record<MbtiType, MbtiType[]> = {
  INTJ: ['ENFP', 'ESFP', 'ISFJ'],
  INTP: ['ESFJ', 'ESTJ', 'ENFJ'],
  ENTJ: ['INFP', 'ISFP', 'ISFJ'],
  ENTP: ['ISTJ', 'ISFJ', 'INFJ'],
  INFJ: ['ESTP', 'ENTP', 'ESTJ'],
  INFP: ['ENTJ', 'ESTJ', 'ESFJ'],
  ENFJ: ['ISTP', 'INTP', 'ISTJ'],
  ENFP: ['INTJ', 'ISTJ', 'ISFJ'],
  ISTJ: ['ENFP', 'ENTP', 'ESFP'],
  ISFJ: ['ENTP', 'ESTP', 'INTJ'],
  ESTJ: ['INFP', 'ISFP', 'INTP'],
  ESFJ: ['INTP', 'ISTP', 'INTJ'],
  ISTP: ['ENFJ', 'ESFJ', 'INFJ'],
  ISFP: ['ENTJ', 'ESTJ', 'ENFJ'],
  ESTP: ['INFJ', 'ISFJ', 'INFP'],
  ESFP: ['INTJ', 'ISTJ', 'INFJ']
}
