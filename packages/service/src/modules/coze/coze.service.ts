import { CozeAPI } from "@coze/api";

import { env } from "../../config/env";
import { AppError } from "../../shared/http/app-error";
import { ensureString } from "../../shared/utils/string";
import { MBTI_TYPES } from "./coze.constants";
import type { RunCozeWorkflowBody } from "./coze.types";

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

    return result;
  } catch (error) {
    const message =
      error instanceof Error && error.message
        ? error.message
        : "Coze workflow failed";

    throw new AppError(message, 502);
  }
}
