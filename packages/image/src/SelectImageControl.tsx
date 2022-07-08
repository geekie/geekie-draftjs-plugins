import { EditorState } from 'draft-js';
import React, { ChangeEventHandler, useRef, useState } from 'react';
import { useClickAway, useDropArea } from 'react-use';
import addImage from './modifiers/addImage';
import { getUploadImage } from './register';
import { SelectImageIcon } from './SelectImageIcon';
import { defaultTheme } from './theme';

interface DraftToolbarControlProps {
  getEditorState: () => EditorState;
  onChange: (state: EditorState) => void;
}

export type SelectImageControl = React.ComponentType<DraftToolbarControlProps>;

export const control: React.ComponentType<DraftToolbarControlProps> = (
  props
) => {
  const { getEditorState, onChange } = props;
  const refImageInput = useRef<HTMLInputElement>(null);
  const [showFileDropPanel, setShowFileDropPanel] = useState(false);
  const [candidateImage, setCandidateImage] = useState<string | null>(null);
  const panelRef = useRef(null);

  const handleCancel = (): void => {
    setCandidateImage(null);
    setShowFileDropPanel(false);
  };

  const handleSubmit = (): void => {
    if (candidateImage) {
      const editorState = getEditorState();
      const newEditorState = addImage(editorState, candidateImage, {});
      onChange(newEditorState);

      handleCancel();
    }
  };

  useClickAway(panelRef, (event) => {
    event.stopPropagation();

    handleCancel();
  });

  const handleSelectFile = (file: File): void => {
    // Check file type is image or not
    const isImage = file && file.type.split('/')[0] === 'image';

    if (isImage) {
      getUploadImage()(file).then((imageUrl) => {
        if (imageUrl) {
          setCandidateImage(imageUrl);
        }
      });
    }
  };

  const handleImageChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const file = e.target.files && e.target.files[0];

    // Clear current file value to allow reselect the same image.
    e.target.value = '';

    if (file) {
      handleSelectFile(file);
    }
  };

  const [bond] = useDropArea({
    onFiles: (files) => files[0] && handleSelectFile(files[0]),
  });

  const renderFileDropPanel: () => React.ReactElement = () => (
    <div className={defaultTheme.selectImageControlPanel}>
      <div className={defaultTheme.selectImageControlPanelTitle}>
        <span className={defaultTheme.selectImageControlPanelTitleLabel}>
          Carregar arquivo
        </span>
        <span className={defaultTheme.selectImageControlPanelTitleBorder} />
      </div>

      <div
        className={defaultTheme.dropFileZone}
        onClick={() => {
          if (refImageInput.current) {
            refImageInput.current.click();
          }
        }}
        {...bond}
      >
        <div className={defaultTheme.dropFileZoneContent}>
          {!candidateImage ? (
            <div className={defaultTheme.dropFileZonePlaceholder}>
              Arraste uma imagem aqui ou clique para carregar
            </div>
          ) : (
            <img
              className={defaultTheme.dropFileZoneImage}
              src={candidateImage}
            />
          )}
        </div>
      </div>

      <div className={defaultTheme.selectImageButtonGroup}>
        <div
          className={`${defaultTheme.selectImageButton}${
            !candidateImage ? ` ${defaultTheme.selectImageButtonDisabled}` : ''
          }`}
          onClick={() => {
            handleSubmit();
          }}
        >
          Ok
        </div>
        <div
          className={defaultTheme.selectImageButton}
          onClick={() => {
            handleCancel();
          }}
        >
          Cancelar
        </div>
      </div>
    </div>
  );

  return (
    <span className={defaultTheme.selectImageControlContainer} ref={panelRef}>
      <button className="Draftail-ToolbarButton">
        <span className="Draftail-ToolbarButton__label">
          <SelectImageIcon
            onClick={() => {
              setShowFileDropPanel(!showFileDropPanel);
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
