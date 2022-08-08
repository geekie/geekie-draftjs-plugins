import { EditorState } from 'draft-js';
import React, { useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import addSymbol from './modifiers/addSymbol';
import { AddSymbolIcon, CloseIcon } from './AddSymbolIcon';
import { defaultTheme } from './theme';
import { catetoriesOptions, symbols } from './constants';

interface DraftToolbarControlProps {
  getEditorState: () => EditorState;
  onChange: (state: EditorState) => void;
}

export type SelectImageControl = React.ComponentType<DraftToolbarControlProps>;

export const control: React.ComponentType<DraftToolbarControlProps> = (
  props
) => {
  const { getEditorState, onChange } = props;
  const [showSymbolPanel, setShowSymbolPanel] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(catetoriesOptions[0]);

  const handleCancel = (): void => {
    setShowSymbolPanel(false);
  };

  const currentSymbols = symbols[currentCategory] || [];

  const handleInsertSymbol = (symbol: string): void => {
    if (symbol) {
      const editorState = getEditorState();

      const newEditorState = addSymbol(editorState, symbol);
      onChange(newEditorState);
    }
  };

  const renderSymbolPanel: () => React.ReactElement = () => (
    <div className={defaultTheme.addSymbolControlPanel}>
      <div className={defaultTheme.addSymbolControlPanelTitle}>
        <span className={defaultTheme.addSymbolControlPanelTitleLabel}>
          Selecione um caractere especial
        </span>
        <span className={defaultTheme.addSymbolControlPanelTitleBorder} />
      </div>

      <CloseIcon className={defaultTheme.closeIcon} onClick={handleCancel} />

      <Dropdown
        className={defaultTheme.addSymbolDropdown}
        options={catetoriesOptions}
        onChange={(option) => setCurrentCategory(option.value)}
        value={currentCategory}
      />

      <div
        className={defaultTheme.symbolGrids}
        style={currentSymbols.length <= 63 ? { overflowY: 'hidden' } : {}}
      >
        {currentSymbols.map((symbol: string) => (
          <div
            key={symbol}
            className={defaultTheme.symbolGrid}
            onClick={() => {
              handleInsertSymbol(symbol);
            }}
          >
            {symbol}
          </div>
        ))}
      </div>

      <div
        className={defaultTheme.closeButton}
        onClick={() => {
          handleCancel();
        }}
      >
        Fechar
      </div>
    </div>
  );

  return (
    <span className={defaultTheme.addSymbolControlContainer}>
      <button className="Draftail-ToolbarButton">
        <span className="Draftail-ToolbarButton__label">
          <AddSymbolIcon
            style={{ width: '12px', height: '12px' }}
            onClick={() => {
              setShowSymbolPanel(!showSymbolPanel);
            }}
          />
        </span>
      </button>

      {showSymbolPanel ? renderSymbolPanel() : null}
    </span>
  );
};
