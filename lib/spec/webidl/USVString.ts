import { convertStringIntoScalarValueString } from "@spec/infra";

import { DOMString } from "./DOMString";

export function USVString(raw: unknown): string {
  const string = DOMString(raw);
  return convertStringIntoScalarValueString(string);
}
