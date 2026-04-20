// https://infra.spec.whatwg.org/#leading-surrogate
export const leadingSurrogate: RegExp = /[\uD800-\uDBFF]/;
export const leadingSurrogates: RegExp = /[\uD800-\uDBFF]/g;

// https://infra.spec.whatwg.org/#trailing-surrogate
export const trailingSurrogate: RegExp = /[\uDC00-\uDFFF]/;
export const trailingSurrogates: RegExp = /[\uDC00-\uDFFF]/g;

// https://infra.spec.whatwg.org/#surrogate
export const surrogate: RegExp = /[\uD800-\uDFFF]/;
export const surrogates: RegExp = /[\uD800-\uDFFF]/g;
