export interface StringDiff {
  areEqual: boolean;
  missingInValidated: string[];
  addedInValidated: string[];
  left: string;
  right: string;
}

const tokenize = (value: string) => value.split(/\s+/).filter(Boolean);

export const diffStrings = (left: string, right: string): StringDiff => {
  const normalizedLeft = left.trim();
  const normalizedRight = right.trim();

  const leftWords = new Set(tokenize(normalizedLeft));
  const rightWords = new Set(tokenize(normalizedRight));

  const missingInValidated = [...leftWords].filter((word) => !rightWords.has(word));
  const addedInValidated = [...rightWords].filter((word) => !leftWords.has(word));

  return {
    areEqual: normalizedLeft === normalizedRight,
    missingInValidated,
    addedInValidated,
    left: normalizedLeft,
    right: normalizedRight
  };
};
