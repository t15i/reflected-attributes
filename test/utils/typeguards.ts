import { type ErrorExpected } from "./types";

export function isErrorExpected(raw: unknown): raw is ErrorExpected {
  if (raw instanceof Error) {
    return true;
  }

  if (typeof raw === "function" && raw.prototype instanceof Error) {
    return true;
  }

  return false;
}
