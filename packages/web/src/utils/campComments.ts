import type { Topic } from '../types/topic'
import type { VoteSide } from '../types/controversy'

export function buildOpposingCampComments(topic: Topic, userSide: VoteSide) {
  const opposingLabel = userSide === 'support' ? topic.sideB.label : topic.sideA.label
  const userLabel = userSide === 'support' ? topic.sideA.label : topic.sideB.label

  return {
    campLabel: opposingLabel,
    comments: [
      `「${opposingLabel}」不是情绪发泄，是你们这边把复杂问题简化成口号了。`,
      `别急着给「${userLabel}」贴正义标签，现实里很多问题根本没有非黑即白。`,
      `你们现在爽的是站队感，真正要付代价的是后面政策和社会信任的修复成本。`
    ]
  }
}
