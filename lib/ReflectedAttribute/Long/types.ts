import { type ReflectedAttributeOptions } from "@/ReflectedAttribute/types";

export interface ReflectedLongOptions extends ReflectedAttributeOptions {
  /**
   * A boolean value indicating whether the attribute is required to be non-negative.
   *
   * When set to true, this option only declares the behavior
   * but does not guarantee that the return value will be strictly non-negative.
   * @see {@link https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes | Reflecting content attributes} for more details.
   *
   * @example
   * ```ts
   * customElements.define('custom-element', \@ReflectedTarget class extends HTMLElement {
   *   \@ReflectedLong({ nonNegative: true })
   *   accessor value: number
   * })
   *
   * el = document.createElement('custom-element')
   * el.value
   * // -1
   *
   * el.setAttribute('value', '42')
   * el.value
   * // 42
   * ```
   */
  nonNegative?: boolean | undefined;

  /**
   * A numeric value that will be used if the content attribute is not specified,
   * cannot be parsed, or is parsed but does not satisfy the constraints of long (`[-2^31; 2^31-1]`).
   *
   * Note that the provided value will be mapped to a Web IDL `long` first and only then used.
   * This means, for example, that `2^32` will be mapped to `-2^32`, `2^32 + 1` to `-2^32 + 1`, and so on.
   * @see {@link https://webidl.spec.whatwg.org/#js-long | JavaScript binding for Web IDL long} for more details.
   *
   * @example
   * ```ts
   * customElements.define('custom-element', \@ReflectedTarget class extends HTMLElement {
   *   \@ReflectedLong({ defaultValue: 42 })
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
