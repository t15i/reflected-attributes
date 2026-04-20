import { type ReflectedAttributeOptions } from "@/ReflectedAttribute/types";

export interface ReflectedUSVStringOptions extends ReflectedAttributeOptions {
  /**
   * A boolean value indicating whether the USVString should be treated as a URL.
   *
   * @example
   * ```ts
   * customElements.define('custom-element', \@ReflectedTarget class extends HTMLElement {
   *   \@ReflectedUSVString({ url: true })
   *   accessor href: string
   * })
   *
   * el = document.createElement('custom-element')
   * el.setAttribute('href', './image.png')
   * el.href
   * // https://example.com/image.png
   * ```
   */
  url?: boolean | undefined;
}
