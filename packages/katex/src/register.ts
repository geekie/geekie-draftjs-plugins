type InsertKatexCallback = (() => void) | null;

let insertKatexCallback: InsertKatexCallback = null;

export const getInsertKatexCallback: () => InsertKatexCallback = () =>
  insertKatexCallback;

export const registerInsertKatexCallback: (
  newCallback: InsertKatexCallback
) => void = (newCallback) => {
  if (typeof newCallback !== 'function') {
    throw Error('should pass a valid InsertKatexCallback');
  } else {
    insertKatexCallback = newCallback;
  }
};

type MathInputWidthCallback = ((width: number) => void) | null;

let mathInputWidthCallback: MathInputWidthCallback = null;

export const getMathInputWidthCallback: () => MathInputWidthCallback = () =>
  mathInputWidthCallback;

export const registerMathInputWidthCallback: (
  newCallback: MathInputWidthCallback
) => void = (newCallback) => {
  if (typeof newCallback !== 'function') {
    throw Error('should pass a valid MathInputWidthCallback');
  } else {
    mathInputWidthCallback = newCallback;
  }
};
