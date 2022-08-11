import { EditorState, AtomicBlockUtils } from "draft-js";
import { KATEX_ENTITY } from "../entity";

type Props = {
  initialValue: string;
  editorState: EditorState;
}

export default ({ initialValue, editorState }: Props): EditorState => {
  const contentState = editorState.getCurrentContent();
  const newContentState = contentState.createEntity(KATEX_ENTITY, "IMMUTABLE", {
    value: initialValue
  });

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
