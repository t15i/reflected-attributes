import { type ReflectedAttributeOptions } from "@/ReflectedAttribute/types";

export interface ReflectedUnsignedLongOptions extends ReflectedAttributeOptions {
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
   *   \@ReflectedUnsignedLong({ positive: true })
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
   * An array whose first two values are numbers defining the attribute's allowed value range.
   *
   * Note that the provided values will be mapped to a Web IDL `unsigned long` first and only then used.
   * This means, for example, that `2^32` will be mapped to `0`, `2^32 + 1` to `1`, and so on.
   * After mapping, the values are sorted. As a result, the effective range may differ from the
   * provided one, but it is never empty.
   * @see {@link https://webidl.spec.whatwg.org/#js-unsigned-long | JavaScript binding for Web IDL unsinged long} for more details.
   *
   * @example
   * ```ts
   * customElements.define('custom-element', \@ReflectedTarget class extends HTMLElement {
   *   \@ReflectedUnsignedLong({ range: [42, 42000] })
   *   accessor value: number
   * })
   *
   * el = document.createElement('custom-element')
   * el.value
   * // 42
   *
   * el.setAttribute('value', '4.2')
   * el.value
   * // 42
   *
   * el.setAttribute('value', '420000')
   * el.value
   * // 42000
   * ```
   */
  range?: [number, number] | undefined;

  /**
   * A numeric value that will be used if the content attribute is not specified,
   * cannot be parsed, or is parsed but does not satisfy the constraints.
   *
   * Note that the provided values will be mapped to a Web IDL `unsigned long` first and only then used.
   * This means, for example, that `2^32` will be mapped to `0`, `2^32 + 1` to `1`, and so on.
   * @see {@link https://webidl.spec.whatwg.org/#js-unsigned-long | JavaScript binding for Web IDL unsinged long} for more details.
   *
   * @example
   * ```ts
   * customElements.define('custom-element', \@ReflectedTarget class extends HTMLElement {
   *   \@ReflectedUnsingedLong({ defaultValue: 42 })
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
