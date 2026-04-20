import { ReflectedDOMString } from "lib";

import {
  contentSetTest,
  createAttributeBuilder,
  defaultValueTest,
  idlSetTest,
  testReflection,
  TestTable,
} from "../../utils";

const sym = Symbol("sym");
const obj = {};
const fn = () => 0;

const singleKeyword = ["on", "off"];
const multipleKeywords = [
  ["", "off", "no"],
  ["on", "yes"],
];

const tests = new TestTable(
  {
    contentName: [undefined, "type"],
    knownValues: [undefined, singleKeyword, multipleKeywords],
    invalidValueDefault: [undefined, "invalid"],
    missingValueDefault: [undefined, "missing"],
    emptyValueDefault: [undefined, "empty"],
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
    idlSetTest("no", "no", "no"),
    idlSetTest("yes", "yes", "yes"),
    idlSetTest("off", "off", "off"),
    idlSetTest("on", "on", "on"),
    idlSetTest("string", "string", "string"),
    idlSetTest(sym, "Symbol(sym)", "Symbol(sym)"),
    idlSetTest(null, "null", "null"),
    idlSetTest(obj, "[object Object]", "[object Object]"),
    idlSetTest(BigInt(0), "0", "0"),
    idlSetTest(BigInt(42), "42", "42"),
    idlSetTest(
      BigInt("9007199254740993"), // Number.MAX_SAFE_INTEGER + 2
      "9007199254740993",
      "9007199254740993",
    ),
    idlSetTest(fn, "()=>0", "()=>0"),
    contentSetTest(null, ""),
    contentSetTest("", ""),
    contentSetTest("off", "off"),
    contentSetTest("on", "on"),
    contentSetTest("no", "no"),
    contentSetTest("yes", "yes"),
    contentSetTest("string", "string"),
  ],
);

tests.override(
  {
    knownValues: [singleKeyword, multipleKeywords],
  },
  [
    idlSetTest(undefined, "", "undefined"),
    idlSetTest(false, "", "false"),
    idlSetTest(true, "", "true"),
    idlSetTest(0, "", "0"),
    idlSetTest(1, "", "1"),
    idlSetTest(42, "", "42"),
    idlSetTest(-42, "", "-42"),
    // prettier-ignore
    idlSetTest(4.200, "", "4.2"),
    idlSetTest(NaN, "", "NaN"),
    idlSetTest("", "", ""),
    idlSetTest("no", "", "no"),
    idlSetTest("yes", "", "yes"),
    idlSetTest("off", "off", "off"),
    idlSetTest("on", "on", "on"),
    idlSetTest("string", "", "string"),
    idlSetTest(sym, "", "Symbol(sym)"),
    idlSetTest(null, "", "null"),
    idlSetTest(obj, "", "[object Object]"),
    idlSetTest(BigInt(0), "", "0"),
    idlSetTest(BigInt(42), "", "42"),
    idlSetTest(BigInt("9007199254740993"), "", "9007199254740993"),
    idlSetTest(fn, "", "()=>0"),
    contentSetTest("", ""),
    contentSetTest("no", ""),
    contentSetTest("yes", ""),
    contentSetTest("off", "off"),
    contentSetTest("on", "on"),
    contentSetTest("string", ""),
  ],
);

tests.override(
  {
    knownValues: [singleKeyword, multipleKeywords],
    invalidValueDefault: ["invalid"],
  },
  [
    idlSetTest(undefined, "invalid", "undefined"),
    idlSetTest(false, "invalid", "false"),
    idlSetTest(true, "invalid", "true"),
    idlSetTest(0, "invalid", "0"),
    idlSetTest(1, "invalid", "1"),
    idlSetTest(42, "invalid", "42"),
    idlSetTest(-42, "invalid", "-42"),
    // prettier-ignore
    idlSetTest(4.200, "invalid", "4.2"),
    idlSetTest(NaN, "invalid", "NaN"),
    idlSetTest("", "invalid", ""),
    idlSetTest("no", "invalid", "no"),
    idlSetTest("yes", "invalid", "yes"),
    idlSetTest("string", "invalid", "string"),
    idlSetTest(sym, "invalid", "Symbol(sym)"),
    idlSetTest(null, "invalid", "null"),
    idlSetTest(obj, "invalid", "[object Object]"),
    idlSetTest(BigInt(0), "invalid", "0"),
    idlSetTest(BigInt(42), "invalid", "42"),
    idlSetTest(BigInt("9007199254740993"), "invalid", "9007199254740993"),
    idlSetTest(fn, "invalid", "()=>0"),
    contentSetTest("", "invalid"),
    contentSetTest("no", "invalid"),
    contentSetTest("yes", "invalid"),
    contentSetTest("string", "invalid"),
  ],
);

tests.override(
  {
    knownValues: [singleKeyword],
    emptyValueDefault: ["empty"],
  },
  [idlSetTest("", "empty", ""), contentSetTest("", "empty")],
);

tests.override(
  {
    knownValues: [singleKeyword, multipleKeywords],
    missingValueDefault: ["missing"],
  },
  [defaultValueTest("missing"), contentSetTest(null, "missing")],
);

tests.override(
  {
    knownValues: [multipleKeywords],
  },
  [
    idlSetTest("", "off", ""),
    idlSetTest("no", "off", "no"),
    idlSetTest("yes", "on", "yes"),
    contentSetTest("", "off"),
    contentSetTest("no", "off"),
    contentSetTest("yes", "on"),
  ],
);

testReflection("@ReflectedDOMString", tests, (options) => {
  const builder = createAttributeBuilder(ReflectedDOMString(options), "", {
    contentName: options.contentName,
  });

  return () => builder().attribute;
});
