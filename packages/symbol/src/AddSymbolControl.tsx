import { EditorState } from 'draft-js';
import React, { useEffect, useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import Draggable from 'react-draggable';
import addSymbol from './modifiers/addSymbol';
import { AddSymbolIcon, CloseIcon } from './AddSymbolIcon';
import { defaultTheme } from './theme';
import { catetoriesOptions, symbols } from './constants';

interface DraftToolbarControlProps {
  getEditorState: () => EditorState;
  onChange: (state: EditorState) => void;
}

export type SelectImageControl = React.ComponentType<DraftToolbarControlProps>;

function getRecentlyUsedFromStorage(): string[] {
  try {
    const recentlyUsedString =
      localStorage.getItem('Symbol_Editor_Plugin_Recently_Used') || '';

    return recentlyUsedString.split(',').filter((v) => !!v);
  } catch (_err) {
    return [];
  }
}

function setRecentlyUsedToStorage(list: string[]): string {
  try {
    const value = list.join(',');
    localStorage.setItem('Symbol_Editor_Plugin_Recently_Used', value);
    return value;
  } catch (_err) {
    return '';
  }
}

export const control: React.ComponentType<DraftToolbarControlProps> = (
  props
) => {
  const { getEditorState, onChange } = props;
  const [showSymbolPanel, setShowSymbolPanel] = useState(false);
  const [recentlyUsedList, setRecentlyUsedList] = useState(
    getRecentlyUsedFromStorage()
  );
  const [currentCategory, setCurrentCategory] = useState(
    recentlyUsedList.length > 0 ? 'Recentes' : catetoriesOptions[0]
  );

  const handleCancel = (): void => {
    setShowSymbolPanel(false);
  };

  const currentSymbols =
    currentCategory === 'Recentes'
      ? recentlyUsedList
      : symbols[currentCategory] || [];

  const handleInsertSymbol = (symbol: string): void => {
    if (symbol) {
      const editorState = getEditorState();

      const newEditorState = addSymbol(editorState, symbol);
      onChange(newEditorState);

      if (currentCategory !== 'Recentes') {
        // Update recently used list
        const newList = recentlyUsedList.filter((v) => v !== symbol);
        newList.unshift(symbol);
        setRecentlyUsedList(newList);
      }
    }
  };

  useEffect(() => {
    // Update recently used list
    setRecentlyUsedToStorage(recentlyUsedList);
  }, [recentlyUsedList]);

  const renderSymbolPanel: () => React.ReactElement = () => (
    <Draggable>
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
          options={(recentlyUsedList.length > 0 ? ['Recentes'] : []).concat(
            catetoriesOptions
          )}
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
    </Draggable>
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
