import {
  type ReflectedTarget,
  type ReflectedIDLAttribute,
  type ReflectedContentAttribute,
} from "./types";

export type {
  ReflectedTarget,
  ReflectedIDLAttribute,
  ReflectedContentAttribute,
};

export function getter(this: ReflectedTarget): boolean {
  return this.getContentAttribute() !== null;
}

export function setter(
  this: ReflectedTarget,
  _: ReflectedIDLAttribute,
  __: ReflectedContentAttribute,
  value: boolean,
): void {
  if (value === false) {
    this.deleteContentAttribute();
  }

  if (value === true) {
    this.setContentAttribute("");
  }
}
