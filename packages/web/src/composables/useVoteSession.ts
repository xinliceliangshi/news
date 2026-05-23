import { ref } from 'vue'

import type { MbtiType } from '../constants/mbti'
import type { VoteSide } from '../types/controversy'
import type { CozeWorkflowResult } from '../utils/cozeOutput'

const STORAGE_KEY = 'news:vote-session'

export type CozeStatus = 'idle' | 'pending' | 'done' | 'error'

export type VoteSession = {
  topicId: number
  topicTitle: string
  side: VoteSide
  sideLabel: string
  mbti: MbtiType
  cozeOutput?: CozeWorkflowResult
  cozeStatus?: CozeStatus
}

function readSession(): VoteSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }

    return JSON.parse(raw) as VoteSession
  } catch {
    return null
  }
}

function writeSession(session: VoteSession | null) {
  if (!session) {
    sessionStorage.removeItem(STORAGE_KEY)
    return
  }

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session))
}

const voteSession = ref<VoteSession | null>(readSession())

export function useVoteSession() {
  function setVoteSession(session: VoteSession) {
    voteSession.value = session
    writeSession(session)
  }

  function patchCozeOutput(output: CozeWorkflowResult) {
    if (!voteSession.value) {
      return
    }

    const next = {
      ...voteSession.value,
      cozeOutput: output,
      cozeStatus: 'done' as const
    }
    voteSession.value = next
    writeSession(next)
  }

  function patchCozeStatus(status: CozeStatus) {
    if (!voteSession.value) {
      return
    }

    const next = { ...voteSession.value, cozeStatus: status }
    voteSession.value = next
    writeSession(next)
  }

  function clearVoteSession() {
    voteSession.value = null
    writeSession(null)
  }

  return {
    voteSession,
    setVoteSession,
    patchCozeOutput,
    patchCozeStatus,
    clearVoteSession
  }
}
