import { ReflectedUSVString } from "lib";

import {
  contentSetTest,
  createAttributeBuilder,
  defaultValueTest,
  idlSetTest,
  resolveURL,
  testReflection,
  TestTable,
} from "../../utils";

// 2048 surrogates total
const minSurrogateCharCode = 0xd800;
const maxSurrogateCharCode = 0xdfff;
const surrogateTestNumber = 64; // divider of 2048 to check both min and max
const surrogateTestGap =
  (maxSurrogateCharCode - minSurrogateCharCode + 1) / surrogateTestNumber;

const surrogateTests = [
  ...Array(surrogateTestNumber)
    .keys()
    .map((i) =>
      String.fromCharCode(minSurrogateCharCode + i * surrogateTestGap),
    ),
];

const urlTests = [
  "//example.org???@#",
  "./relative/path",
  "blob:https://example.org/path/to/resource",
];

const tests = new TestTable(
  {
    contentName: [undefined, "href"],
    url: [undefined, false, true],
  },
  [
    defaultValueTest(""),
    idlSetTest(undefined, "undefined", "undefined"),
    idlSetTest(false, "false", "false"),
    idlSetTest(true, "true", "true"),
    idlSetTest(0, "0", "0"),
    idlSetTest(1, "1", "1"),
    idlSetTest(42, "42", "42"),
    idlSetTest(-42, "-42", "-42"),
    // prettier-ignore
    idlSetTest(4.200, "4.2", "4.2"),
    idlSetTest(NaN, "NaN", "NaN"),
    idlSetTest("", "", ""),
    idlSetTest("string", "string", "string"),
    idlSetTest("string", "string", "string"),
    idlSetTest("\u{D7FF}", "\u{D7FF}", "\u{D7FF}"),
    idlSetTest("\u{E000}", "\u{E000}", "\u{E000}"),
    ...surrogateTests.map((test) => idlSetTest(test, "\u{FFFD}", "\u{FFFD}")),
    ...urlTests.map((test) => idlSetTest(test, test, test)),
    idlSetTest(Symbol("sym"), "Symbol(sym)", "Symbol(sym)"),
    idlSetTest(null, "null", "null"),
    idlSetTest({}, "[object Object]", "[object Object]"),
    idlSetTest(BigInt(0), "0", "0"),
    idlSetTest(BigInt(42), "42", "42"),
    idlSetTest(
      BigInt("9007199254740993"), // Number.MAX_SAFE_INTEGER + 2
      "9007199254740993",
      "9007199254740993",
    ),
    idlSetTest(() => 0, "()=>0", "()=>0"),
    contentSetTest(null, ""),
    contentSetTest("", ""),
    contentSetTest("string", "string"),
    contentSetTest("\u{D7FF}", "\u{D7FF}"),
    contentSetTest("\u{E000}", "\u{E000}"),
    ...surrogateTests.map((test) => contentSetTest(test, "\u{FFFD}")),
    ...urlTests.map((test) => contentSetTest(test, test)),
  ],
);

tests.override(
  {
    url: [true],
  },
  [
    ...tests
      .items()
      .filter(
        ({ testHead, expected }) =>
          !(
            testHead.type === "defaultValue" ||
            (testHead.type === "content" && testHead.test === null) ||
            typeof expected.idl !== "string"
          ),
      )
      .map(({ testHead, expected }) => {
        const { type, test } = testHead as
          | { type: "idl"; test: unknown }
          | { type: "content"; test: string };
        const expectedIDL = expected.idl as string;

        switch (type) {
          case "idl":
            return idlSetTest(test, resolveURL(expectedIDL), expected.content);
          case "content":
            return contentSetTest(test, resolveURL(expectedIDL));
        }
      }),
  ],
);

testReflection("@ReflectedUSVString", tests, (options) => {
  const builder = createAttributeBuilder(ReflectedUSVString(options), "", {
    contentName: options.contentName,
  });

  return () => builder().attribute;
});
