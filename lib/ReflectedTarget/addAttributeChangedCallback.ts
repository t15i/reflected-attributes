import { type AttributeChangedCallback } from "./types";

export const unusedAttributeChangedCallbacks: Map<
  string,
  AttributeChangedCallback
> = new Map();

export function addAttributeChangedCallback(
  name: string,
  callback: AttributeChangedCallback,
): void {
  if (unusedAttributeChangedCallbacks.has(name)) {
    throw Error(
      `Content attribute '${name}' is already reflected by another IDL attribute. This may indicate a collision in the attribute declaration or a missing @ReflectedTarget.`,
    );
  }

  unusedAttributeChangedCallbacks.set(name, callback);
}
