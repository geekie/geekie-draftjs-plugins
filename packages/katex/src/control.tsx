import { EditorState } from 'draft-js';
import React from 'react';
import insertKatexBlock from './modifiers/insertKatexBlock';

const buttonTooltipText = 'Equações';

export const ButtonIcon = (): JSX.Element => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.4444 0H1.55556C0.7 0 0 0.7 0 1.55556V12.4444C0 13.3 0.7 14 1.55556 14H12.4444C13.3 14 14 13.3 14 12.4444V1.55556C14 0.7 13.3 0 12.4444 0ZM12.4444 12.4444H1.55556V1.55556H12.4444V12.4444Z"
      fill="#333333"
    />
    <path
      d="M6.41672 3.67188H2.52783V4.83854H6.41672V3.67188Z"
      fill="#333333"
    />
    <path
      d="M11.6667 9.91797H7.77783V11.0846H11.6667V9.91797Z"
      fill="#333333"
    />
    <path
      d="M11.6667 7.97266H7.77783V9.13932H11.6667V7.97266Z"
      fill="#333333"
    />
    <path
      d="M3.88881 11.6684H5.05547V10.1128H6.61103V8.94618H5.05547V7.39062H3.88881V8.94618H2.33325V10.1128H3.88881V11.6684Z"
      fill="#333333"
    />
    <path
      d="M8.62547 6.18203L9.72214 5.08536L10.8188 6.18203L11.6432 5.35759L10.5466 4.25314L11.6432 3.15648L10.8188 2.33203L9.72214 3.4287L8.62547 2.33203L7.80103 3.15648L8.89769 4.25314L7.80103 5.35759L8.62547 6.18203Z"
      fill="#333333"
    />
  </svg>
);

type Props = {
  getEditorState: () => EditorState;
  onChange: (editorState: EditorState) => void;
};

const InsertKatexBlockButton = (props: Props): JSX.Element => {
  const { getEditorState, onChange } = props;

  const onClick = (): void => {
    const editorState = getEditorState();
    onChange(insertKatexBlock({ editorState }));
  };

  return (
    <span>
      <button
        className="GeekieKatex-ToolbarButton Draftail-ToolbarButton"
        aria-label={buttonTooltipText}
        data-draftail-balloon={buttonTooltipText}
        onClick={onClick}
      >
        <span className="Draftail-ToolbarButton__label">
          <ButtonIcon />
        </span>
      </button>
    </span>
  );
};

export default InsertKatexBlockButton;
