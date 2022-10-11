import { ContentBlock, EditorState } from 'draft-js';
import katex from 'katex';
import MathInput from 'math-input-web-support/dist/components/app';
import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import KatexOutput from './KatexOutput';
import { getInsertKatexCallback } from '../register';
import { defaultTheme } from '../theme';

type KatexInternals = typeof katex & {
  __parse: (s: string) => void;
};

type RGB = `rgb(${number}, ${number}, ${number})`;
type RGBA = `rgba(${number}, ${number}, ${number}, ${number})`;
type HEX = `#${string}`;
type Color = RGB | RGBA | HEX | string;

export type Rule = {
  minWidth: number;
  tipText?: string;
  tipColor?: Color;
  disableButton?: true;
};

export type KateBlockProps = {
  getEditorState: () => EditorState;
  onRemove: (key: string) => void;
  onStartEdit: (key: string) => void;
  onFinishEdit: (key: string, newEditorState: EditorState) => void;
  rules?: Rule[];
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
  const { getEditorState, rules, onRemove, onStartEdit, onFinishEdit } =
    blockProps;

  const data: KatexBlockState = getEditorState()
    .getCurrentContent()
    .getEntity(block.getEntityAt(0))
    .getData();

  const [isEditing, setIsEditing] = useState(data.isEditing);
  const [isInvalidTex, setIsInvalidTex] = useState(data.isInvalidTex);
  const [value, setValue] = useState(data.value);
  const [tipColor, setTipColor] = useState<Color | undefined>();
  const [tipText, setTipText] = useState<string | undefined>();
  const [disableButton, setDisableButton] = useState<true | undefined>();
  const mathInput = useRef<{ focus: () => void }>(null);
  const inputSize = useRef<HTMLDivElement>(null);

  const callbacks: { [key: string]: () => void } = {};

  let rulesSorted: Rule[] | undefined;
  if (rules && rules.length) {
    rulesSorted = [...rules];
    rulesSorted.sort((r1, r2) => r2.minWidth - r1.minWidth);
  }

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
    const insertCallback = getInsertKatexCallback();
    if (data.isNew && insertCallback) insertCallback();
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
    marginBottom: 160,
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

  useEffect(() => {
    if (!inputSize.current || !rulesSorted) return;
    const widthWithoutMargins = inputSize.current.clientWidth - 40;
    const triggeredRule = rulesSorted.filter(
      (r) => widthWithoutMargins > r.minWidth
    )[0];
    if (triggeredRule) {
      setTipText(() => triggeredRule.tipText);
      setTipColor(() => triggeredRule.tipColor);
      setDisableButton(() => triggeredRule.disableButton);
    } else {
      setTipText(() => undefined);
      setTipColor(() => undefined);
      setDisableButton(() => undefined);
    }
  }, [value]);

  const isDisabled = isInvalidTex || disableButton || value.trim() === '';
  const isInvalid = isInvalidTex && !(value.trim() === '');

  const tipStyle = tipColor ? { color: tipColor } : {};
  const tip = tipText && <p style={tipStyle}>{tipText}</p>;

  const editingForm = (
    <div className="GeekieKatex-EditPanel">
      <div
        className="GeekieKatex-InfoComponent-Container"
        style={infoComponentStyle}
      >
        {tip}
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
          {isInvalid ? 'Fórmula inválida' : 'Salvar'}
        </button>
        <button style={buttonStyle} onClick={remove}>
          Remover
        </button>
      </div>
    </div>
  );

  const inputSizeStyle: React.CSSProperties = {
    display: 'inline-block',
  };

  const display = isEditing ? (
    <div ref={inputSize} style={inputSizeStyle}>
      <MathInput
        classname={`${defaultTheme.styleGlobal}`}
        callbacks={callbacks}
        katex={katex}
        onChange={onValueChange}
        value={value}
        ref={mathInput}
      />
    </div>
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
