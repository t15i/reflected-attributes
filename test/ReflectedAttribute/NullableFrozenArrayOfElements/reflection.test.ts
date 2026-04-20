import { ReflectedNullableFrozenArrayOfElements } from "lib";

import {
  contentSetTest,
  createAttributeBuilder,
  defaultValueTest,
  idlSetTest,
  testReflection,
  TestTable,
  type Test,
} from "../../utils";

import { createTestElements } from "./utils";

let slot: Element = document.createElement("slot");

const { differentRoot: firstDifferentRoot, ...firstSameRoot } =
  createTestElements("first");
const { differentRoot: secondDifferrntRoot, ...secondSameRoot } =
  createTestElements("second");

const root1 = document.createElement("div");
root1.append(
  ...Object.values(firstSameRoot),
  ...Object.values(secondSameRoot),
  slot,
);

const root2 = document.createElement("div");
root2.append(firstDifferentRoot, secondDifferrntRoot);

const testTable = new TestTable(
  {
    Element: [HTMLInputElement],
    contentName: [undefined, "target"],
  },
  [
    defaultValueTest(null),
    idlSetTest(undefined, TypeError, null),
    idlSetTest(false, TypeError, null),
    idlSetTest(true, TypeError, null),
    idlSetTest(42, TypeError, null),
    idlSetTest(NaN, TypeError, null),
    idlSetTest("string", TypeError, null),
    idlSetTest(Symbol(), TypeError, null),
    idlSetTest(null, null, null),
    idlSetTest({}, TypeError, null),
    idlSetTest(firstSameRoot.firstCandidate, TypeError, null),
    idlSetTest([firstSameRoot.nonImplementing], TypeError, null),
    idlSetTest(
      [
        firstSameRoot.firstCandidate,
        firstSameRoot.secondCandidate,
        firstSameRoot.incorrectId,
        firstDifferentRoot,
      ],
      [
        firstSameRoot.firstCandidate,
        firstSameRoot.secondCandidate,
        firstSameRoot.incorrectId,
      ],
      "",
    ),
    idlSetTest(BigInt(42), TypeError, null),
    idlSetTest(() => 0, TypeError, null),
    contentSetTest(null, null),
    contentSetTest("first", [firstSameRoot.firstCandidate]),
    contentSetTest("second", [secondSameRoot.firstCandidate]),
    contentSetTest("first second", [
      firstSameRoot.firstCandidate,
      secondSameRoot.firstCandidate,
    ]),
    contentSetTest("first second second", [
      firstSameRoot.firstCandidate,
      secondSameRoot.firstCandidate,
      secondSameRoot.firstCandidate,
    ]),
    contentSetTest("first second third", [
      firstSameRoot.firstCandidate,
      secondSameRoot.firstCandidate,
    ]),
    contentSetTest("string", []),
  ] as Test<Element[] | null>[],
);

testReflection(
  "@ReflectedNullableFrozenArrayOfElements",
  testTable,
  (options) => {
    const builder = createAttributeBuilder(
      ReflectedNullableFrozenArrayOfElements(HTMLInputElement, options),
      null,
      {
        contentName: options.contentName,
      },
    );

    return () => {
      const { attribute, details } = builder();

      slot.replaceWith(details.element);
      slot = details.element;

      return attribute;
    };
  },
);
