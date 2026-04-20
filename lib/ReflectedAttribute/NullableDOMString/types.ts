import { type ReflectedAttributeOptions } from "@/ReflectedAttribute/types";

export interface ReflectedNullableDOMStringOptions extends ReflectedAttributeOptions {
  /**
   * An array of (string or array of strings)s describing the mapping of keywords
   * to states.
   * * A string maps single keyword to a single state;
   * * An array of strings maps multiple keywords to a single state.
   *
   * The canonical keyword (the one returned on `get`) is chosen according to the
   * specification. In the case where "the canonical keyword for the state will be
   * explicitly given in the specification", the first keyword that is not an empty
   * string will be selected.
   *
   * @see {@link https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#canonical-keyword | Canonical keyword}
   *
   * @example
   * ```ts
   * customElements.define('custom-element', \@ReflectedTarget class extends HTMLElement {
   *   \@NullableReflectedDOMString({ knownValues: [["on", "yes"], ["off", "no"]] })
   *   accessor autocomplete: string
   * })
   *
   * el = document.createElement('custom-element')
   * el.setAttribute('autocomplete', 'no')
   * el.autocomplete
   * // "off"
   * el.setAttribute('autocomplete', 'yes')
   * el.autocomplete
   * // "on"
   * ```
   */
  knownValues?: (string | string[])[] | undefined;

  /**
   * A string containing the keyword for the state that will be returned when no
   * other state matches.
   *
   * @remarks
   * This option is ignored if {@link NullableReflectedDOMStringOptions.knownValues} is not specified.
   * The provided keyword does not have to be canonical for the selected state.
   * The provided keyword does not have to be associated with a state from
   * {@link NullableReflectedDOMStringOptions.knownValues}; in that case a new state will
   * be created.
   *
   * @example
   * ```ts
   * customElements.define('custom-element', \@ReflectedTarget class extends HTMLElement {
   *   \@NullableReflectedDOMString({ knownValues: ['valid'], invalidValueDefault: 'invalid' })
   *   accessor state: string
   * })
   *
   * el = document.createElement('custom-element')
   * el.state
   * // "invalid"
   *
   * el.setAttribute('state', 'ValiD')
   * el.state
   * // "valid"
   *
   * el.setAttribute('state', 'abracadabra')
   * el.state
   * // "invalid"
   * ```
   */
  invalidValueDefault?: string | undefined;

  /**
   * A string containing the keyword for the state that will be returned when the
   * content attribute is not specified (`null`).
   *
   * @remarks
   * This option is ignored if {@link NullableReflectedDOMStringOptions.knownValues} is not specified.
   * The provided keyword does not have to be canonical for the selected state.
   * The provided keyword does not have to be associated with a state from
   * {@link NullableReflectedDOMStringOptions.knownValues}; in that case a new state will
   * be created.
   *
   * @example
   * ```ts
   * customElements.define('custom-element', @ReflectedTarget class extends HTMLElement {
   *   @NullableReflectedDOMString({ knownValues: ['known'], missingValueDefault: 'missing' })
   *   accessor state: string
   * })
   *
   * el = document.createElement('custom-element')
   * el.state
   * // "missing"
   * el.setAttribute('state', 'KnowN')
   * el.state
   * // "known"
   * ```
   */
  missingValueDefault?: string | undefined;

  /**
   * A string containing the keyword for the state that will be returned when the
   * content attribute does not match any state from
   * {@link NullableReflectedDOMStringOptions.knownValues} and is an empty string (`''`).
   *
   * @remarks
   * This option is ignored if {@link NullableReflectedDOMStringOptions.knownValues} is not specified.
   * The provided keyword does not have to be canonical for the selected state.
   * The provided keyword does not have to be associated with a state from
   * {@link NullableReflectedDOMStringOptions.knownValues}; in that case a new state will
   * be created.
   *
   * @example
   * ```ts
   * customElements.define('custom-element', @ReflectedTarget class extends HTMLElement {
   *   @NullableReflectedDOMString({ knownValues: [], emptyDefaultValue: 'empty' })
   *   accessor state: string
   * })
   *
   * el = document.createElement('custom-element')
   * el.setAttribute('state', '')
   * el.state
   * // "empty"
   * ```
   */
  emptyValueDefault?: string | undefined;
}
