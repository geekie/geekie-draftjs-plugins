import { ContentBlock, EditorState } from 'draft-js';
import katex from 'katex';
import MathInput from 'math-input-web-support/dist/components/app';
import React, {
  ChangeEvent,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from 'react';
import KatexOutput from './KatexOutput';

type KatexInternals = typeof katex & {
  __parse: (s: string) => void;
};

export type KateBlockProps = {
  getEditorState: () => EditorState;
  infoComponent?: ReactElement;
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
  const { getEditorState, infoComponent, onRemove, onStartEdit, onFinishEdit } =
    blockProps;
  // eslint-disable-next-line no-console
  console.log(props, 'props KatexBlock');
  // eslint-disable-next-line no-console
  console.log(infoComponent, 'infoComponent KatexBlock');
  const data: KatexBlockState = getEditorState()
    .getCurrentContent()
    .getEntity(block.getEntityAt(0))
    .getData();

  const [isEditing, setIsEditing] = useState(data.isEditing);
  const [isInvalidTex, setIsInvalidTex] = useState(data.isInvalidTex);
  const [value, setValue] = useState(data.value);
  const mathInput = useRef<{ focus: () => void }>(null);

  const callbacks: { [key: string]: () => void } = {};

  const onValueChange = (
    evt: ChangeEvent<HTMLTextAreaElement> | string
  ): void => {
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
    editorState
      .getCurrentContent()
      .mergeEntityData(entityKey, { value, isNew: false });
    setIsInvalidTex(false);
    setIsEditing(false);
    finishEdit(editorState);
  };

  if (data.isNew && !isEditing) startEdit();

  const buttonStyle: React.CSSProperties = {
    width: 74,
    height: 30,
    border: '1px solid #f1f1f1',
    borderRadius: '2px',
    padding: '7px 9px',
    background: '#fff',
    margin: '0 3px',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '13px',
    lineHeight: '16px',
    color: '#111112',
    cursor: 'pointer',
  };

  const infoComponentStyle: React.CSSProperties = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  };

  useEffect(() => {
    if (!mathInput.current) return;
    mathInput.current.focus();
  }, [isEditing]);

  const isDisabled = isInvalidTex || value.trim() === '';
  const isInvalid = isInvalidTex && !(value.trim() === '');

  const editingForm = (
    <div className="GeekieKatex-EditPanel">
      <div
        className="GeekieKatex-InfoComponent-Container"
        style={infoComponentStyle}
      >
        {infoComponent}
      </div>
      <div className="GeekieKatex-EditPanel-Buttons">
        <button
          style={{
            ...buttonStyle,
            width: isInvalid ? 'auto' : 74,
            color: isDisabled ? '#A9A8A8' : '#111112',
            backgroundColor: isDisabled ? '#EBE9E9' : 'transparent',
            pointerEvents: isDisabled ? 'none' : 'all',
          }}
          disabled={isDisabled}
          onClick={save}
        >
          {isInvalid ? 'Sintaxe inválida' : 'Salvar'}
        </button>
        <button style={buttonStyle} onClick={remove}>
          Remover
        </button>
      </div>
    </div>
  );

  const display = isEditing ? (
    <MathInput
      callbacks={callbacks}
      katex={katex}
      onChange={onValueChange}
      value={value}
      ref={mathInput}
    />
  ) : (
    <KatexOutput onClick={startEdit} value={value} />
  );

  const style: React.CSSProperties = {
    textAlign: 'center',
  };

  return (
    <div style={style}>
      {display}
      {isEditing && editingForm}
    </div>
  );
};

export default KatexBlock;
