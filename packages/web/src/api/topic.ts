import { http } from './client'
import type { ApiResponse } from '../types/auth'
import type { Topic, VoteTopicPayload, VoteTopicResult } from '../types/topic'

export type ListTopicsQuery = {
  tag?: string
  keyword?: string
  limit?: number
}

export async function fetchTopics(query?: ListTopicsQuery) {
  return http.get<ApiResponse<Topic[]>>('/topics', {
    params: query
  })
}

export async function fetchTopicById(id: number) {
  return http.get<ApiResponse<Topic>>(`/topics/${id}`)
}

export async function voteOnTopic(id: number, payload: VoteTopicPayload) {
  return http.post<ApiResponse<VoteTopicResult>>(`/topics/${id}/vote`, payload)
}
