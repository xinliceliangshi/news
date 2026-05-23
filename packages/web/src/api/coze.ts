import { http } from './client'
import type { ApiResponse } from '../types/auth'
import type { MbtiType } from '../constants/mbti'
import type { CozeWorkflowResult } from '../utils/cozeOutput'

export type RunCozeWorkflowPayload = {
  topic: string
  side: string
  mbti: MbtiType
}

export async function runCozeWorkflow(payload: RunCozeWorkflowPayload) {
  return http.post<ApiResponse<CozeWorkflowResult>>('/coze/workflow/run', payload)
}
