import { ContentBlock, EditorState } from 'draft-js';
import 'katex/dist/katex.min.css';
import 'mathquill-commonjs/mathquill.css';
import { ReactElement } from 'react';
import KatexBlock, { KateBlockProps } from './components/KatexBlock';
import control from './control';
import { KATEX_ENTITY } from './entity';
import removeKatexBlock from './modifiers/removeKatexBlock';

export { registerInsertKatexCallback } from './register';

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

type KatexPluginProps = {
  infoComponent?: ReactElement;
};

export default (props: KatexPluginProps): KatexPlugin => {
  const blocksInEditingMode = new Map();
  const { infoComponent } = props;

  return {
    blockRendererFn: (
      block,
      { getEditorState, setEditorState, setReadOnly }
    ) => {
      if (block.getType() !== 'atomic') return null;
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
          infoComponent,

          onStartEdit: (blockKey: string) => {
            setReadOnly(true);
            blocksInEditingMode.set(blockKey, true);
          },

          onFinishEdit: (blockKey: string, newEditorState: EditorState) => {
            blocksInEditingMode.delete(blockKey);
            if (!blocksInEditingMode.size) setReadOnly(false);
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
            const newEditorState = removeKatexBlock(editorState, blockKey);
            setReadOnly(false);
            setEditorState(newEditorState);
          },
        },
      };
    },
    control,
    entityType: {
      type: KATEX_ENTITY,
    },
  };
};
