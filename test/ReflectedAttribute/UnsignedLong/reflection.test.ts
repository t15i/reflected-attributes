import { ReflectedUnsignedLong } from "lib";

import {
  contentSetTest,
  createAttributeBuilder,
  defaultValueTest,
  idlSetTest,
  testReflection,
  TestTable,
  type Test,
} from "../../utils";

type Range = [number, number];

const sym = Symbol("sym");
const obj = {};
const fn = () => 0;

const defaultValue = [-4294967283 /*= 13 (mod 2^32)*/, 13];

const rangeNegative: Range = [-4294967254, -4294925296 /*= 42000 (mod 2^32)*/];
const rangePositive: Range = [42, 42000];
const rangeExtra: Range = [0, 2147483648];

const tests = new TestTable(
  {
    contentName: [undefined, "target"],
    positive: [undefined, false, true],
    defaultValue: [undefined, ...defaultValue],
    range: [undefined, rangeNegative, rangePositive, rangeExtra],
  },
  [
    defaultValueTest(0),
    idlSetTest(undefined, 0, "0"),
    idlSetTest(false, 0, "0"),
    idlSetTest(true, 1, "1"),
    idlSetTest(-42 /*= 4294967254 (mod 2^32)*/, 0, "0"),
    idlSetTest(0, 0, "0"),
    idlSetTest(1, 1, "1"),
    idlSetTest(2.71828182846, 2, "2"),
    idlSetTest(41, 41, "41"),
    idlSetTest(42, 42, "42"),
    idlSetTest(42000, 42000, "42000"),
    idlSetTest(42001, 42001, "42001"),
    idlSetTest(2147483647 /* = 2^31 - 1 */, 2147483647, "2147483647"),
    idlSetTest(2147483648, 0, "0"),
    idlSetTest(NaN, 0, "0"),
    idlSetTest("42", 42, "42"),
    idlSetTest("string", 0, "0"),
    idlSetTest(sym, TypeError, null),
    idlSetTest(null, 0, "0"),
    idlSetTest(obj, 0, "0"),
    idlSetTest(BigInt(42), 42, "42"),
    idlSetTest(fn, 0, "0"),
    contentSetTest(null, 0),
    contentSetTest("-42", 0),
    contentSetTest("0", 0),
    contentSetTest("1", 1),
    contentSetTest("41", 41),
    contentSetTest("42", 42),
    contentSetTest("42000", 42000),
    contentSetTest("42001", 42001),
    contentSetTest("2147483648", 0),
    contentSetTest("string", 0),
  ] as Test<number>[],
);

tests.override(
  {
    positive: [true],
  },
  [
    defaultValueTest(1),
    idlSetTest(-42, 1, "1"),
    idlSetTest(2147483648, 1, "1"),
    contentSetTest(null, 1),
    contentSetTest("-42", 1),
    contentSetTest("0", 1),
    contentSetTest("2147483648", 1),
    contentSetTest("string", 1),
  ] as Test<number>[],
);

tests.override(
  {
    defaultValue: [-4294967283, 13],
  },
  [
    defaultValueTest(13),
    idlSetTest(-42, 13, "13"),
    idlSetTest(2147483648, 13, "13"),
    contentSetTest(null, 13),
    contentSetTest("-42", 13),
    contentSetTest("2147483648", 13),
    contentSetTest("string", 13),
  ],
);

tests.override(
  {
    positive: [true],
    defaultValue,
  },
  [contentSetTest("0", 13)],
);

tests.override(
  {
    range: [rangePositive, rangeNegative],
  },
  [
    defaultValueTest(42),
    idlSetTest(undefined, 42, "0"),
    idlSetTest(false, 42, "0"),
    idlSetTest(true, 42, "1"),
    idlSetTest(-42, 42, "0"),
    idlSetTest(0, 42, "0"),
    idlSetTest(1, 42, "1"),
    idlSetTest(2.71828182846, 42, "2"),
    idlSetTest(41, 42, "41"),
    idlSetTest(42001, 42000, "42001"),
    idlSetTest(2147483647, 42000, "2147483647"),
    idlSetTest(2147483648, 42, "0"),
    idlSetTest(NaN, 42, "0"),
    idlSetTest("string", 42, "0"),
    idlSetTest(null, 42, "0"),
    idlSetTest(obj, 42, "0"),
    idlSetTest(fn, 42, "0"),
    contentSetTest(null, 42),
    contentSetTest("-42", 42),
    contentSetTest("0", 42),
    contentSetTest("1", 42),
    contentSetTest("41", 42),
    contentSetTest("42001", 42000),
    contentSetTest("2147483648", 42000),
    contentSetTest("string", 42),
  ],
);

tests.override(
  {
    positive: [true],
    range: [rangePositive, rangeNegative],
  },
  [
    idlSetTest(-42, 42, "1"),
    idlSetTest(2147483648, 42, "1"),
    contentSetTest("0", 42),
  ] as Test<number>[],
);

tests.override(
  {
    defaultValue,
    range: [rangePositive, rangeNegative],
  },
  [
    defaultValueTest(13),
    idlSetTest(-42, 42, "13"),
    idlSetTest(2147483648, 42, "13"),
    contentSetTest(null, 13),
    contentSetTest("-42", 13),
    contentSetTest("string", 13),
  ],
);

tests.override(
  {
    range: [rangeExtra],
  },
  [
    defaultValueTest(0),
    contentSetTest(null, 0),
    contentSetTest("-42", 0),
    contentSetTest("0", 0),
    contentSetTest("2147483648", 2147483648),
    contentSetTest("string", 0),
  ],
);

tests.override(
  {
    defaultValue,
    range: [rangeExtra],
  },
  [
    defaultValueTest(13),
    idlSetTest(-42, 13, "13"),
    idlSetTest(2147483648, 13, "13"),
    contentSetTest(null, 13),
    contentSetTest("-42", 13),
    contentSetTest("string", 13),
  ],
);

tests.override({ positive: [true] }, [
  idlSetTest(undefined, DOMException, null),
  idlSetTest(false, DOMException, null),
  idlSetTest(0, DOMException, null),
  idlSetTest(NaN, DOMException, null),
  idlSetTest("string", DOMException, null),
  idlSetTest(null, DOMException, null),
  idlSetTest(obj, DOMException, null),
  idlSetTest(fn, DOMException, null),
] as unknown as Test<number>[]);

testReflection("@ReflectedUnsignedLong", tests, (options) => {
  const builder = createAttributeBuilder(ReflectedUnsignedLong(options), 0, {
    contentName: options.contentName,
  });

  return () => builder().attribute;
});
