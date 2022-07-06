import { EditorState } from 'draft-js';
import React, { ChangeEventHandler, useRef, useState } from 'react';
import addImage from './modifiers/addImage';
import { SelectImageIcon } from './SelectImageIcon';
import { defaultTheme } from './theme';

interface DraftToolbarControlProps {
  getEditorState: () => EditorState;
  onChange: (state: EditorState) => void;
}

export type SelectImageControl = React.ComponentType<DraftToolbarControlProps>;

export const control: React.ComponentType<DraftToolbarControlProps> = () => {
  const refImageInput = useRef<HTMLInputElement>(null);
  const [showFileDropPanel, setShowFileDropPanel] = useState(false);

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files && e.target.files[0];

    // Clear current file value to allow reselect the same image.
    e.target.value = '';

    if (file) {
      addImage('mock');
    }
  };

  const renderFileDropPanel = () => (
    <div className={defaultTheme.selectImageControlPanel}>123</div>
  );

  return (
    <span className={defaultTheme.selectImageControlContainer}>
      <button className="Draftail-ToolbarButton">
        <span className="Draftail-ToolbarButton__label">
          <SelectImageIcon
            onClick={() => {
              setShowFileDropPanel(true);
              //if (refImageInput.current) {
              //refImageInput.current.click();
              //}
            }}
          />
        </span>
      </button>

      {showFileDropPanel ? renderFileDropPanel() : null}

      <input
        type="file"
        style={{ display: 'none' }}
        accept="image/*"
        ref={refImageInput}
        onChange={handleImageChange}
      />
    </span>
  );
};
