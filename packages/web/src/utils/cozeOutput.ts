export type CozeWorkflowResult = {
  output: string
  executeId?: string
  debugUrl?: string
  usage?: {
    input_count?: number
    output_count?: number
    token_count?: number
  }
}

function parseOutputPayload(raw: unknown): string {
  if (typeof raw === 'string') {
    const trimmed = raw.trim()

    if (trimmed.startsWith('{')) {
      try {
        const parsed = JSON.parse(trimmed) as Record<string, unknown>

        if (typeof parsed.output === 'string') {
          return parsed.output
        }
      } catch {
        return raw
      }
    }

    return raw
  }

  if (typeof raw === 'object' && raw !== null) {
    const record = raw as Record<string, unknown>

    if (typeof record.output === 'string') {
      return record.output
    }

    if (typeof record.data === 'string' || typeof record.data === 'object') {
      return parseOutputPayload(record.data)
    }
  }

  return ''
}

export function extractCozeOutput(raw: unknown): string {
  if (typeof raw === 'string') {
    return parseOutputPayload(raw)
  }

  if (typeof raw === 'object' && raw !== null) {
    const record = raw as Record<string, unknown>

    if (typeof record.output === 'string') {
      return record.output
    }

    return parseOutputPayload(record.data)
  }

  return ''
}
