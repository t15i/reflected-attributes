import { ReflectedNullableElement } from "lib";

import {
  contentSetTest,
  createAttributeBuilder,
  defaultValueTest,
  idlSetTest,
  testReflection,
  TestTable,
  type Test,
} from "../../utils";

const firstCandidate = document.createElement("input");
firstCandidate.id = "id";
firstCandidate.setAttribute("data-details", "candidate");

const secondCandidate = document.createElement("input");
secondCandidate.id = "id";
secondCandidate.setAttribute("data-details", "notTheFirstCandidate");

const incorrectId = document.createElement("input");
incorrectId.id = "incorrectId";
incorrectId.setAttribute("data-details", "incorrectId");

const nonImplementing = document.createElement("div");
nonImplementing.id = "id";
nonImplementing.setAttribute("data-details", "nonImplementing");

let slot: Element = document.createElement("slot");

const root = document.createElement("div");
root.append(
  incorrectId,
  nonImplementing,
  firstCandidate,
  secondCandidate,
  slot,
);

const differentRoot = document.createElement("input");
differentRoot.id = "id";
differentRoot.setAttribute("data-details", "differentRoot");

const testTable = new TestTable(
  {
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
    idlSetTest(firstCandidate, firstCandidate, ""),
    idlSetTest(secondCandidate, secondCandidate, ""),
    idlSetTest(differentRoot, null, ""),
    idlSetTest(incorrectId, incorrectId, ""),
    idlSetTest(nonImplementing, TypeError, null),
    idlSetTest(BigInt(42), TypeError, null),
    idlSetTest(() => 0, TypeError, null),
    contentSetTest(null, null),
    contentSetTest("id", firstCandidate),
    contentSetTest("string", null),
  ] as Test<Element | null>[],
);

testReflection("@ReflectedElement", testTable, (options) => {
  const builder = createAttributeBuilder(
    ReflectedNullableElement(HTMLInputElement, options),
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
});
