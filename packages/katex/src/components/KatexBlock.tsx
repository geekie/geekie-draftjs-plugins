import React, { ChangeEvent, useState } from "react";
import katex from "katex";
import { ContentBlock, EditorState } from "draft-js";
import KatexOutput from "./KatexOutput";

type KatexInternals = typeof katex & {
  __parse: (s: string) => void;
};

export type KateBlockProps = {
  getEditorState: () => EditorState;
  onRemove: (key: string) => void;
  onStartEdit: (key: string) => void;
  onFinishEdit: (key: string, newEditorState: EditorState) => void;
};

type Props = {
  block: ContentBlock;
  blockProps: KateBlockProps;
};

const KatexBlock = (props: Props): JSX.Element => {
  const { block, blockProps } = props;
  const { getEditorState, onRemove, onStartEdit, onFinishEdit } = blockProps;

  const data = getEditorState().getCurrentContent().getEntity(block.getEntityAt(0)).getData();

  const [isEditing, setIsEditing] = useState(false);
  const [isInvalidTex, setIsInvalidTex] = useState(false);
  const [value, setValue] = useState(data.value);

  const onValueChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    const inputValue = evt.target.value;
    try {
      (katex as KatexInternals).__parse(inputValue);
      setIsInvalidTex(false);
      setValue(inputValue);
    } catch (e) {
      setIsInvalidTex(true);
    }
  };

  const startEdit = (): void => {
    onStartEdit(block.getKey());
    setIsEditing(true);
  };

  const finishEdit = (newContentState: EditorState): void => {
    onFinishEdit(block.getKey(), newContentState);
    setIsEditing(false);
  };

  const remove = (): void => {
    onRemove(block.getKey());
  };

  const save = (): void => {
    const entityKey = block.getEntityAt(0);
    const editorState = getEditorState();
    const contentState = editorState.getCurrentContent();
    contentState.mergeEntityData(entityKey, { value });
    setIsInvalidTex(false);
    setIsEditing(false);
    finishEdit(editorState);
  };

  const editingMode = (
    <div>
      <textarea onChange={onValueChange} value={value} />
      <div>
        <button disabled={isInvalidTex} onClick={save}>
          {isInvalidTex ? "Sintaxe inválida" : "Concluir edição"}
        </button>
        <button type="button" onClick={remove}>
          Remover
        </button>
      </div>
    </div>
  );

  const displayMode = <KatexOutput onClick={startEdit} value={value} />;

  return isEditing ? editingMode : displayMode;
};

export default KatexBlock;
