import { type ReflectedAttributeOptions } from "@/ReflectedAttribute/types";

export interface ReflectedDoubleOptions extends ReflectedAttributeOptions {
  /**
   * A boolean value indicating whether the attribute is required to be positive.
   *
   * When set to true, this option only declares the behavior
   * but does not guarantee that the return value will be strictly positive.
   * @see {@link https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes | Reflecting content attributes} for more details.
   *
   * @example
   * ```ts
   * customElements.define('custom-element', \@ReflectedTarget class extends HTMLElement {
   *   \@ReflectedDouble({ positive: true })
   *   accessor value: number
   * })
   *
   * el = document.createElement('custom-element')
   * el.value
   * // 0
   *
   * el.setAttribute('value', '42')
   * el.value
   * // 42
   * ```
   */
  positive?: boolean | undefined;

  /**
   * A numeric value that will be used if the content attribute is not specified,
   * cannot be parsed, or is parsed but does not satisfy the constraints.
   *
   * @example
   * ```ts
   * customElements.define('custom-element', \@ReflectedTarget class extends HTMLElement {
   *   \@ReflectedDouble({ defaultValue: 42 })
   *   accessor value: number
   * })
   *
   * el = document.createElement('custom-element')
   * el.value
   * // 42
   *
   * el.setAttribute('value', 'non-numeric')
   * el.value
   * // 42
   * ```
   */
  defaultValue?: number | undefined;
}
