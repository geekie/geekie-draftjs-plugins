import { EditorState, AtomicBlockUtils } from 'draft-js';

export const IMAGE_ENTITY_TYPE = 'GEEKIE_IMAGE';

export default (
  editorState: EditorState,
  url: string,
  extraData: Record<string, unknown>
): EditorState => {
  const urlType = IMAGE_ENTITY_TYPE;
  const contentState = editorState.getCurrentContent();
  const contentStateWithEntity = contentState.createEntity(
    urlType,
    'IMMUTABLE',
    { ...extraData, src: url, isNew: true }
  );
  const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
  const newEditorState = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    entityKey,
    ' '
  );
  return EditorState.forceSelection(
    newEditorState,
    newEditorState.getCurrentContent().getSelectionAfter()
  );
};
