export interface TestElements {
  firstCandidate: Element;
  secondCandidate: Element;
  incorrectId: Element;
  nonImplementing: Element;
  differentRoot: Element;
}

export function createTestElements(id: string): TestElements {
  const firstCandidate = document.createElement("input");
  firstCandidate.id = id;
  firstCandidate.setAttribute("data-details", "candidate");

  const secondCandidate = document.createElement("input");
  secondCandidate.id = id;
  secondCandidate.setAttribute("data-details", "notTheFirstCandidate");

  const incorrectId = document.createElement("input");
  incorrectId.id = "incorrectId";
  incorrectId.setAttribute("data-details", "incorrectId");

  const nonImplementing = document.createElement("div");
  nonImplementing.id = id;
  nonImplementing.setAttribute("data-details", "nonImplementing");

  const differentRoot = document.createElement("input");
  differentRoot.id = id;
  differentRoot.setAttribute("data-details", "differentRoot");

  return {
    firstCandidate,
    secondCandidate,
    incorrectId,
    nonImplementing,
    differentRoot,
  };
}
