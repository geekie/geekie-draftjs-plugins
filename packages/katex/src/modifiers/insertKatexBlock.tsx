import { EditorState, AtomicBlockUtils } from "draft-js";
import { KatexBlockState } from "../components/KatexBlock";
import { KATEX_ENTITY } from "../entity";

type Props = {
  editorState: EditorState;
}

export default ({ editorState }: Props): EditorState => {
  const contentState = editorState.getCurrentContent();
  const newContentState = contentState.createEntity(KATEX_ENTITY, "IMMUTABLE", {
    value: '',
    isEditing: false,
    isInvalidTex: false,
    isNew: true
  } as KatexBlockState);

  const newEditorState = AtomicBlockUtils.insertAtomicBlock(
    editorState,
    newContentState.getLastCreatedEntityKey(),
    " "
  );

  return EditorState.forceSelection(
    newEditorState,
    newEditorState.getCurrentContent().getSelectionAfter()
  );
};
