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
