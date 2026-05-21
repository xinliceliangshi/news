export type VoteSide = 'support' | 'oppose'

export interface ControversyTopic {
  title: string
  supportLabel: string
  opposeLabel: string
  voters: string
  supportRate: number
  opposeRate: number
  iqLeft: number
}
