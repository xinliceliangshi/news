import { http } from './client'
import type { ApiResponse } from '../types/auth'
import type { MbtiType } from '../constants/mbti'

export type RunCozeWorkflowPayload = {
  topic: string
  side: string
  mbti: MbtiType
}

export async function runCozeWorkflow(payload: RunCozeWorkflowPayload) {
  return http.post<ApiResponse<unknown>>('/coze/workflow/run', payload)
}
