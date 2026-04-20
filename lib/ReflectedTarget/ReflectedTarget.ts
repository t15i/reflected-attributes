import { unusedFamilies } from "./ReflectedTargetFamily";
import { unusedAttributeChangedCallbacks } from "./addAttributeChangedCallback";

import { type CustomElementConstructor } from "./types";
import { asCustomElementConstructor } from "./typeguards";

/**
 * Decorates a custom element to allow reflected attributes.
 *
 * @param target - The constructor function of the custom element.
 *
 * @remarks
 * Applying this decorator is required for any custom element class that uses reflected attributes.
 * Otherwise, accessing an reflected attribute will throw an error.
 *
 * The decorator does not use or validate the context object, so it can be called without one.
 *
 * @example
 * ```typescript
 * // decorate as a reflected target
 * \@ReflectedTarget
 * class HTMLCustomElement extends HTMLElement {
 *   // now ReflectedAttribute decorators can be used
 *   \@ReflectedBoolean({ contentName: "checked" })
 *   accessor defaultChecked: boolean = false
 * }
 * ```
 */
export function ReflectedTarget<T extends CustomElementConstructor>(
  constructor: T,
): T {
  constructor = asCustomElementConstructor(constructor) as T;

  if (
    unusedFamilies.length === 0 &&
    unusedAttributeChangedCallbacks.size === 0
  ) {
    return constructor;
  }

  const families = [...unusedFamilies];
  unusedFamilies.length = 0;

  const attributeChangedCallbacks = new Map(unusedAttributeChangedCallbacks);
  unusedAttributeChangedCallbacks.clear();

  return class extends constructor {
    static override observedAttributes = [
      ...(constructor.observedAttributes ?? []),
      ...attributeChangedCallbacks.keys(),
    ];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    constructor(...args: any[]) {
      super(...args);
      families.forEach((family) => family.add(this));
    }

    override attributeChangedCallback(
      name: string,
      oldValue: string | null,
      value: string | null,
      namespace: string | null,
    ): void {
      name = String(name);
      oldValue = oldValue !== null ? String(oldValue) : null;
      value = value !== null ? String(value) : null;
      namespace = namespace !== null ? String(namespace) : null;

      if (namespace === null) {
        attributeChangedCallbacks
          .get(name)
          ?.call(this, name, oldValue, value, namespace);
      }

      if (typeof super.attributeChangedCallback === "function") {
        super.attributeChangedCallback?.(name, oldValue, value, namespace);
      }
    }
  };
}
