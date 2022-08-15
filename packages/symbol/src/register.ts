let insertSymbolCallback: InsertSymbolCallback = null;

type InsertSymbolCallback = ((symbol: string) => void) | null;

export const getInsertSymbolCallback: () => InsertSymbolCallback = () =>
  insertSymbolCallback;

export const registerInsertSymbolCallback: (
  newCallback: InsertSymbolCallback
) => void = (newCallback) => {
  if (typeof newCallback !== 'function') {
    throw Error('should pass a valid InsertSymbolCallback');
  } else {
    insertSymbolCallback = newCallback;
  }
};

