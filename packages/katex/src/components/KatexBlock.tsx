import React, { ChangeEvent, useState } from "react";
import katex from "katex";
import { ContentBlock, EditorState } from "draft-js";
import MathInput from "math-input-web-support/dist/components/app";
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

export type KatexBlockState = {
  value: string;
  isEditing: boolean;
  isInvalidTex: boolean;
  isNew: boolean;
};

type Props = {
  block: ContentBlock;
  blockProps: KateBlockProps;
};

const KatexBlock = (props: Props): JSX.Element => {
  const { block, blockProps } = props;
  const { getEditorState, onRemove, onStartEdit, onFinishEdit } = blockProps;

  const data: KatexBlockState = getEditorState().getCurrentContent().getEntity(block.getEntityAt(0)).getData();

  const [isEditing, setIsEditing] = useState(data.isEditing);
  const [isInvalidTex, setIsInvalidTex] = useState(data.isInvalidTex);
  const [value, setValue] = useState(data.value);

  const callbacks: {[key: string]: () => void} = {};

  const onValueChange = (evt: ChangeEvent<HTMLTextAreaElement> | string): void => {
    const inputValue = typeof evt === 'string' ? evt : evt.target.value;
    try {
      if (inputValue.trim() === '') throw new Error();
      (katex as KatexInternals).__parse(inputValue);
      setIsInvalidTex(false);
    } catch (e) {
      setIsInvalidTex(true);
    } finally {
      setValue(inputValue);
    }
  };

  const onFocus = (): void => {
    if (callbacks.blur) callbacks.blur();
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
    editorState.getCurrentContent().mergeEntityData(entityKey, { value, isNew: false });
    setIsInvalidTex(false);
    setIsEditing(false);
    finishEdit(editorState);
  };

  if (data.isNew && !isEditing) startEdit();

  const editingForm = (
    <div>
      <textarea onChange={onValueChange} onFocus={onFocus} value={value} />
      <div>
        <button disabled={isInvalidTex || value.trim() === ''} onClick={save}>
          {isInvalidTex ? "Sintaxe inválida" : "Concluir edição"}
        </button>
        <button type="button" onClick={remove}>
          Remover
        </button>
      </div>
    </div>
  );

  const display = isEditing
    ? <MathInput
        callbacks={callbacks}
        displayMode
        katex={katex}
        onChange={onValueChange}
        value={value}
      />
    // ? <KatexOutput onClick={() => {}} value={value} />
    : <KatexOutput onClick={startEdit} value={value} />;
  
  return (
    <div>
      {display}
      {isEditing && editingForm}
    </div>
  );
};

export default KatexBlock;
