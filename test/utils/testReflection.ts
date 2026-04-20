import { beforeEach, describe, expect, test } from "vitest";

import { TestTable } from "./TestTable";
import { type Attribute } from "./types";
import { isErrorExpected } from "./typeguards";

export function testReflection<Opt extends object, T>(
  description: string,
  testTable: TestTable<T, Opt>,
  getAttributeBuilder: (options: Opt) => () => Attribute<T>,
): void {
  describe(description, () => {
    describe.for([...testTable.options()])("%o", (options) => {
      const attributeBuilder = getAttributeBuilder(options);

      let attribute: Attribute<T>;
      beforeEach(() => (attribute = attributeBuilder()));

      const defaultValueExpected = testTable.get(options, {
        type: "defaultValue",
        test: null,
      });
      if (defaultValueExpected !== undefined) {
        test(`default value should be ${defaultValueExpected.idl} (IDL), ${defaultValueExpected.content} (content)`, () => {
          expect(attribute.idl).toBe(defaultValueExpected.idl);
          expect(attribute.content).toBe(defaultValueExpected.content);
        });
      }

      describe("set (IDL)", () => {
        const tests = [
          ...testTable
            .testHeads()
            .filter(({ type }) => type === "idl")
            .map(
              (testHead) =>
                [testHead.test, testTable.get(options, testHead)!] as const,
            ),
        ];

        test.each(tests)("%o -> %o", (test, expected) => {
          if (isErrorExpected(expected.idl)) {
            expect(() => (attribute.idl = test)).toThrow(expected.idl);
          } else {
            attribute.idl = test;
            if (Array.isArray(expected.idl)) {
              expect(attribute.idl).toEqual(expected.idl);
            } else {
              expect(attribute.idl).toBe(expected.idl);
            }
          }
          expect(attribute.content).toBe(expected.content);
        });
      });

      describe("set (content)", () => {
        const tests = [
          ...testTable
            .testHeads()
            .filter(({ type }) => type === "content")
            .map(
              (testHead) =>
                [testHead.test, testTable.get(options, testHead)!] as const,
            ),
        ];

        test.each(tests)("%o -> %o", (test, expected) => {
          if (typeof test !== "string" && test !== null) {
            throw TypeError(
              `Test bug: test value for content attribute must be a string or null`,
            );
          }

          attribute.content = test;
          if (isErrorExpected(expected.idl)) {
            expect(() => (attribute.idl = test)).toThrow(expected.idl);
          } else if (Array.isArray(expected.idl)) {
            expect(attribute.idl).toEqual(expected.idl);
          } else {
            expect(attribute.idl).toBe(expected.idl);
          }
          expect(attribute.content).toBe(expected.content);
        });
      });
    });
  });
}
