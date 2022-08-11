import { ContentBlock, EditorState } from "draft-js";
import { KATEX_ENTITY } from "./entity";
import control from "./control";
import KatexBlock, { KateBlockProps } from "./components/KatexBlock";
import removeTexBlock from "./modifiers/removeKatexBlock";

type DraftStateMethods = {
  getEditorState: () => EditorState;
  setEditorState: (newEditorState: EditorState) => void;
  setReadOnly: (isReadOnly: boolean) => void;
};

type KatexPlugin = {
  blockRendererFn: (
    block: ContentBlock,
    { getEditorState, setEditorState, setReadOnly }: DraftStateMethods
  ) => {
    component: typeof KatexBlock;
    editable: boolean;
    props: KateBlockProps;
  } | null;
  control: typeof control;
  entityType: {
    type: string;
  };
};

export default (): KatexPlugin => {
  const blocksInEditingMode = new Map();

  return {
    blockRendererFn: (
      block,
      { getEditorState, setEditorState, setReadOnly }
    ) => {
      if (block.getType() !== "atomic") return null;
      const contentState = getEditorState().getCurrentContent();
      const entity = block.getEntityAt(0);
      if (!entity) return null;
      const type = contentState.getEntity(entity).getType();
      if (type !== KATEX_ENTITY) return null;

      return {
        component: KatexBlock,
        editable: false,
        props: {
          getEditorState,

          onStartEdit: (blockKey: string) => {
            setReadOnly(true);
            blocksInEditingMode.set(blockKey, true);
          },

          onFinishEdit: (blockKey: string, newEditorState: EditorState) => {
            setReadOnly(false);
            blocksInEditingMode.delete(blockKey);
            setEditorState(
              EditorState.forceSelection(
                newEditorState,
                newEditorState.getSelection()
              )
            );
          },

          onRemove: (blockKey: string) => {
            blocksInEditingMode.delete(blockKey);
            const editorState = getEditorState();
            const newEditorState = removeTexBlock(editorState, blockKey);
            setEditorState(newEditorState);
          }
        }
      };
    },
    control,
    entityType: {
      type: KATEX_ENTITY
    }
  };
};
