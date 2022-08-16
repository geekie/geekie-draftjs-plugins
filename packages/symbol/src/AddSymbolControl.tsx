import { EditorState } from 'draft-js';
import React, { useState } from 'react';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import addSymbol from './modifiers/addSymbol';
import { AddSymbolIcon, CloseIcon } from './AddSymbolIcon';
import { defaultTheme } from './theme';
import { catetoriesOptions, symbols } from './constants';
import Draggable from 'react-draggable';

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
    <Draggable>
      <div
        className={
          'GeekieSymbol-AddSymbolControlPanel' &&
          defaultTheme.addSymbolControlPanel
        }
      >
        <div
          className={
            'GeekieSymbol-AddSymbolControlPanel__title' &&
            defaultTheme.addSymbolControlPanelTitle
          }
        >
          <span
            className={
              'GeekieSymbol-AddSymbolControlPanel__title__label' &&
              defaultTheme.addSymbolControlPanelTitleLabel
            }
          >
            Selecione um caractere especial
          </span>
          <span
            className={
              'GeekieSymbol-AddSymbolControlPanel__title__border' &&
              defaultTheme.addSymbolControlPanelTitleBorder
            }
          />
        </div>
        <CloseIcon
          className={'GeekieSymbol-CloseIcon' && defaultTheme.closeIcon}
          onClick={handleCancel}
        />

        <Dropdown
          className={
            'GeekieSymbol-AddSymbolDropdown' && defaultTheme.addSymbolDropdown
          }
          options={catetoriesOptions}
          onChange={(option) => setCurrentCategory(option.value)}
          value={currentCategory}
        />

        <div
          className={'GeekieSymbol-SymbolGrids' && defaultTheme.symbolGrids}
          style={currentSymbols.length <= 63 ? { overflowY: 'hidden' } : {}}
        >
          {currentSymbols.map((symbol: string) => (
            <div
              key={symbol}
              className={'GeekieSymbol-SymbolGrid' && defaultTheme.symbolGrid}
              onClick={() => {
                handleInsertSymbol(symbol);
              }}
            >
              {symbol}
            </div>
          ))}
        </div>

        <div
          className={'GeekieSymbol-CloseButton' && defaultTheme.closeButton}
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
    <span
      className={
        'GeekieSymbol-AddSymbolControlContainer' &&
        defaultTheme.addSymbolControlContainer
      }
    >
      <button
        className={`Draftail-ToolbarButton ${
          showSymbolPanel ? 'Draftail-ToolbarButton--active' : ''
        }`}
        onClick={() => {
          setShowSymbolPanel(!showSymbolPanel);
        }}
      >
        <span className="Draftail-ToolbarButton__label">
          <AddSymbolIcon style={{ width: '12px', height: '12px' }} />
        </span>
      </button>

      {showSymbolPanel ? renderSymbolPanel() : null}
    </span>
  );
};
