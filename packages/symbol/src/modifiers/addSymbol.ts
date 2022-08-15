import { EditorState, Modifier } from 'draft-js';
import { getInsertSymbolCallback } from '../register';

export default (editorState: EditorState, symbol: string): EditorState => {
  const selection = editorState.getSelection();
  const contentState = editorState.getCurrentContent();
  let nextEditorState = editorState;

  if (selection.isCollapsed()) {
    const nextContentState = Modifier.insertText(
      contentState,
      selection,
      symbol
    );
    nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'insert-characters'
    );
  } else {
    const nextContentState = Modifier.replaceText(
      contentState,
      selection,
      symbol
    );
    nextEditorState = EditorState.push(
      editorState,
      nextContentState,
      'insert-characters'
    );
  }

  const callback = getInsertSymbolCallback();
  if (callback) {
    callback(symbol);
  }


  return nextEditorState;
};
