import { CozeAPI } from "@coze/api";

import { env } from "../../config/env";
import { AppError } from "../../shared/http/app-error";
import { ensureString } from "../../shared/utils/string";
import { MBTI_TYPES } from "./coze.constants";
import type {
  CozeWorkflowResult,
  RunCozeWorkflowBody,
} from "./coze.types";

function parseMbti(value: string) {
  const mbti = value.trim().toUpperCase();

  if (!MBTI_TYPES.includes(mbti as (typeof MBTI_TYPES)[number])) {
    throw new AppError("mbti must be a valid 4-letter type", 400);
  }

  return mbti;
}
const cozeClient = new CozeAPI({
  token: env.cozeApiKey,
  baseURL: env.cozeBaseUrl,
});

function parseOutputPayload(raw: unknown): string {
  if (typeof raw === "string") {
    const trimmed = raw.trim();

    if (trimmed.startsWith("{")) {
      try {
        const parsed = JSON.parse(trimmed) as Record<string, unknown>;

        if (typeof parsed.output === "string") {
          return parsed.output;
        }
      } catch {
        return raw;
      }
    }

    return raw;
  }

  if (typeof raw === "object" && raw !== null) {
    const record = raw as Record<string, unknown>;

    if (typeof record.output === "string") {
      return record.output;
    }

    if (typeof record.data === "string" || typeof record.data === "object") {
      return parseOutputPayload(record.data);
    }
  }

  return "";
}

function normalizeCozeWorkflowResult(result: unknown): CozeWorkflowResult {
  if (!result || typeof result !== "object") {
    throw new AppError("Invalid Coze workflow response", 502);
  }

  const record = result as Record<string, unknown>;
  const code = record.code;

  if (typeof code === "number" && code !== 0) {
    const message =
      typeof record.msg === "string" && record.msg.trim()
        ? record.msg
        : "Coze workflow failed";

    throw new AppError(message, 502);
  }

  const output = parseOutputPayload(record.data);

  if (!output.trim()) {
    throw new AppError("Coze workflow returned empty output", 502);
  }

  return {
    output,
    executeId:
      typeof record.execute_id === "string" ? record.execute_id : undefined,
    debugUrl:
      typeof record.debug_url === "string" ? record.debug_url : undefined,
    usage:
      typeof record.usage === "object" && record.usage !== null
        ? (record.usage as CozeWorkflowResult["usage"])
        : undefined,
  };
}

export async function runCozeWorkflow(payload: RunCozeWorkflowBody) {
  if (!env.cozeApiKey || !env.cozeWorkflowId) {
    throw new AppError("Coze API is not configured", 503);
  }

  const topic = ensureString(payload.topic).trim();
  const side = ensureString(payload.side).trim();
  const mbti = parseMbti(ensureString(payload.mbti));

  if (!topic || !side) {
    throw new AppError("topic and side are required", 400);
  }

  try {
    const result = await cozeClient.workflows.runs.create({
      workflow_id: env.cozeWorkflowId,
      parameters: {
        topics: topic,
        side,
        mbti,
      },
    });

    return normalizeCozeWorkflowResult(result);
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Coze workflow failed";

    throw new AppError(message, 502);
  }
}
