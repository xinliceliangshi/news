import { ref } from 'vue'

import type { MbtiType } from '../constants/mbti'
import type { VoteSide } from '../types/controversy'

const STORAGE_KEY = 'news:vote-session'

export type VoteSession = {
  topicId: number
  topicTitle: string
  side: VoteSide
  sideLabel: string
  mbti: MbtiType
  cozeOutput?: unknown
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

  function patchCozeOutput(output: unknown) {
    if (!voteSession.value) {
      return
    }

    const next = { ...voteSession.value, cozeOutput: output }
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
    clearVoteSession
  }
}
