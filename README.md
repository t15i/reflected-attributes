# reflected-attributes — HTML reflected attributes for Web Components

> **Heads up!** This library relies entirely on accessor class fields from 
the [Stage 3 decorator proposal](https://github.com/tc39/proposal-decorators), 
so at the moment it can't be used outside the TypeScript ecosystem. That said, 
it already ships with typeguards, CDN integration, and is ready to switch to 
native decorators as soon as that becomes possible.

This library provides a simple way to use reflected attributes that conform 
to the HTML specification in your custom Web Components 
through accessor decorators.

## Features

The following types and options are supported 
(in the order they appear in the spec):

* [x] `DOMString`[^1]
	* [x] limited to only known values
* [x] `DOMString?`[^1]
	* [x] limited to only known values
* [x] `USVString`[^1]
	* [x] treated as a URL
* [x] `boolean`[^1]
* [x] `long`[^1]
	* [x] limited to only non-negative numbers
	* [x] default value
* [x] `unsigned long`[^1]
	* [x] limited to only positive numbers
	* [x] limited to only positive numbers with fallback
	* [x] clamped to the range
* [x] `double`[^1]
	* [x] limited to only positive numbers
	* [x] default value
* [ ] `DOMTokenList`
* [x] `T?`[^2]
* [x] `FrozenArray<T>`[^2]

[^1]: the type supports value caching — repeated getter calls do not re-run 
the parsing logic

[^2]: where `T` is either `Element` or an interface 
that inherits from `Element`

You can read more about each option in the 
[corresponding section of the specification](https://html.spec.whatwg.org/multipage/common-dom-interfaces.html#reflecting-content-attributes-in-idl-attributes).

The specification uses WebIDL types, which differ from the 
ones you get in JavaScript. This library takes care of the extra processing 
needed to handle the tricky edge cases correctly: numeric overflow, 
surrogates in USV strings, and so on.

You can read more about the type mapping algorithms 
in the [WebIDL specification](https://webidl.spec.whatwg.org/).

You can also see the options and mappings in action across 
[10,000+ human-readable tests](https://github.com/t15i/reflected-attributes/tree/main/test).

## Examples

To create a reflected attribute, just apply the `ReflectedTarget` decorator to
your custom element class, and the decorator matching the desired type, e.g. 
`ReflectedDOMString` to an accessor field:

```ts
@ReflectedTarget
class HTMLCustomInputElement extends HTMLElement {
  @ReflectedDOMString
  accessor name: string = ''
}
```

```ts
el = document.createElement('custom-input')
el.name = 'search-main'
el.name
// < "search-main"
```

or, if you need to pass options:

```ts
@ReflectedTarget
class HTMLCustomInputElement extends HTMLElement {
  @ReflectedDOMString({
    knownValues: ['text', 'button', 'checkbox', 'radio'],
    missingValueDefault: 'text',
    emptyValueDefault: 'text',
    invalidValueDefault: 'text',
  })
  accessor type: string = ''
}
```

```ts
el = document.createElement('custom-input')
el.type = 'button'
el.type
// < "button"
el.type = 'abracadabra'
el.type
// < "text"
```

The `ReflectedTarget` decorator automatically adds the required names 
to `observedAttributes`. By default, the content attribute has the same name as
the class property, but you can change it with the `contentName` option, which
is available on every `ReflectedAttribute` decorator:

```ts
@ReflectedTarget
class HTMLCustomDivElement extends HTMLElement {
  @ReflectedNullableDOMString({ 
   contentName: 'aria-checked',
  })
  accessor ariaChecked: string | null = null
}
```
 
```ts
el = document.createElement('custom-div')
el.ariaChecked
// < null
el.setAttribute('aria-checked', 'true')
el.ariaChecked
// < "true"
```

Because of how reflected attributes work, `attributeChangedCallback` is all you
need to react to changes — whether they come from the attribute or from the
property. When control passes to your code, both the attribute and the property
are ready to use:

```ts
@ReflectedTarget
class HTMLCustomInputElement extends HTMLElement {
  @ReflectedDOMString({
    knownValues: ['text', 'button', 'checkbox', 'radio'],
    missingValueDefault: 'text',
    emptyValueDefault: 'text',
    invalidValueDefault: 'text',
  })
  accessor type: string = ''
  
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    if (name === "type") {
      switch (this.type) {
        case "text":
          // text
        case "button":
          // button
        case "checkbox":
          // checkbox
        case "radio":
          // radio
      }
    }
  }
}
```

On top of that, the primitive types — `DOMString`, `DOMString?`, `USVString`, 
`boolean`, `long`, `unsigned long`, and `double` — support caching. This means
that reading the property again does not re-parse the attribute value:

```ts
@ReflectedTarget
class HTMLCustomInputElement extends HTMLElement {
  attributeChangedCallback(
    name: string,
    oldValue: string | null,
    newValue: string | null,
  ) {
    // parses the value from the attribute
    this.#onTypeChanged(this.type)
    // returns the cached value
    this.#onTypeChanged(this.type)
  }
}
```

## Closing notes

I'd be happy if this library turns out to be useful in your work. I've done my 
best to make it easy to maintain and pleasant to contribute to, so please don't
hesitate to [open an Issue](https://github.com/t15i/reflected-attributes/issues)
or [send a Pull Request](https://github.com/t15i/reflected-attributes/pulls).

Happy hacking!
