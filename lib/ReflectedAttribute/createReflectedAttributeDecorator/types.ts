import {
  type ReflectedTarget,
  type ReflectedIDLAttribute,
  type ReflectedContentAttribute,
} from "@spec/html";

export interface ReflectedAttributeSpec<
  Target extends ReflectedTarget,
  IDLAttr extends ReflectedIDLAttribute,
  ContentAttr extends ReflectedContentAttribute,
  Value,
> {
  getter(
    this: Target,
    reflectedIDLAttribute: IDLAttr,
    reflectedContentAttribute: ContentAttr,
  ): Value;
  setter(
    this: Target,
    reflectedIDLAttribute: IDLAttr,
    reflectedContentAttribute: ContentAttr,
    value: Value,
  ): void;
  attributeChanged?(
    this: Target,
    reflectedIDLAttribute: IDLAttr,
    reflectedContentAttribute: ContentAttr,
    element: Element,
    name: string,
    oldValue: string | null,
    value: string | null,
    namespace: string | null,
  ): void;
}

export interface ReflectedAttributeParams<
  Target extends ReflectedTarget,
  IDLAttr extends ReflectedIDLAttribute,
  ContentAttr extends ReflectedContentAttribute,
  Value,
> {
  initReflectedTarget: (
    element: Element,
    context: {
      reflectedIDLAttribute: IDLAttr;
      reflectedContentAttribute: ContentAttr;
      accessor: ClassAccessorDecoratorTarget<Element, Value>;
    },
  ) => Target;
  initReflectedIDLAttribute: (context: { idlName: string }) => IDLAttr;
  initReflectedContentAttribute: (context: { idlName: string }) => ContentAttr;
}

export interface CachedReflectedAttributeParams<
  Target extends ReflectedTarget,
  IDLAttr extends ReflectedIDLAttribute,
  ContentAttr extends ReflectedContentAttribute,
> {
  initReflectedTarget: (
    element: Element,
    context: {
      reflectedIDLAttribute: IDLAttr;
      reflectedContentAttribute: ContentAttr;
    },
  ) => Target;
  initReflectedIDLAttribute: (context: { idlName: string }) => IDLAttr;
  initReflectedContentAttribute: (context: { idlName: string }) => ContentAttr;
}
