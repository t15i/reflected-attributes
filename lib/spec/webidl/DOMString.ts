export function DOMString(
  raw: unknown,
  extendedAttributes?: { legacyNullToEmptyString?: boolean | undefined },
): string {
  if (raw === null && extendedAttributes?.legacyNullToEmptyString) {
    return "";
  }
  return String(raw);
}
