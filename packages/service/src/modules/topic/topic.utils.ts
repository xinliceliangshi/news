import { AppError } from "../../shared/http/app-error";

export function parseTopicId(id: number) {
  if (!Number.isInteger(id) || id <= 0) {
    throw new AppError("invalid topic id", 400);
  }

  return id;
}
