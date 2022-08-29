import { EditorState } from 'draft-js';
import React, { ChangeEventHandler, useRef, useState } from 'react';
import { useClickAway, useDropArea } from 'react-use';
import addImage from './modifiers/addImage';
import { getUploadImage, pluginConfig } from './register';
import { SelectImageIcon } from './SelectImageIcon';
import { defaultTheme } from './theme';
import {
  getAcceptableSize,
  getHeightAndWidthFromDataUrl,
  isValidImageSize,
  isValidImageType,
} from './utils';

const buttonTooltipText = 'Imagem';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showFileDropPanel, setShowFileDropPanel] = useState(false);
  const [candidateImage, setCandidateImage] = useState<string | null>(null);
  const panelRef = useRef(null);

  const handleCancel = (): void => {
    setCandidateImage(null);
    setShowFileDropPanel(false);
    setErrorMessage(null);
  };

  const handleSubmit = async (): Promise<void> => {
    if (!candidateImage) return;
    const editorState = getEditorState();
    const originalSize = await getHeightAndWidthFromDataUrl(candidateImage);
    const acceptableSize = getAcceptableSize(originalSize);
    const newEditorState = addImage(
      editorState,
      candidateImage,
      acceptableSize
    );
    onChange(newEditorState);
    handleCancel();
  };

  useClickAway(panelRef, (event) => {
    event.stopPropagation();
    handleCancel();
  });

  const handleSelectFile = (file: File): void => {
    if (!isValidImageType(file)) return;
    if (!isValidImageSize(file)) {
      setErrorMessage(
        `Insira uma imagem menor que ${pluginConfig.fileLimitation}MB`
      );
      return;
    }
    setErrorMessage(null);
    getUploadImage()(file).then((imageUrl) => {
      if (!imageUrl) return;
      setCandidateImage(imageUrl);
    });
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
    <div
      className={`GeekieImage-SelectImageControlPanel ${defaultTheme.selectImageControlPanel}`}
    >
      <div
        className={`GeekieImage-SelectImageControlPanel__title' ${defaultTheme.selectImageControlPanelTitle}`}
      >
        <span
          className={`GeekieImage-SelectImageControlPanel__title__label ${defaultTheme.selectImageControlPanelTitleLabel}`}
        >
          Carregar arquivo
        </span>
        <span
          className={`GeekieImage-SelectImageControlPanel__title__border ${defaultTheme.selectImageControlPanelTitleBorder}`}
        />
      </div>

      <div
        className={`GeekieImage-DropFileZone ${defaultTheme.dropFileZone}`}
        onClick={() => {
          if (refImageInput.current) {
            refImageInput.current.click();
          }
        }}
        {...bond}
      >
        <div
          className={`GeekieImage-DropFileZone__content ${defaultTheme.dropFileZoneContent}`}
        >
          {!candidateImage ? (
            <div
              className={`GeekieImage-DropFileZone__placeholder ${defaultTheme.dropFileZonePlaceholder}`}
            >
              Arraste uma imagem aqui ou clique para carregar
            </div>
          ) : (
            <img
              className={`GeekieImage-DropFileZone__image ${defaultTheme.dropFileZoneImage}`}
              src={candidateImage}
            />
          )}
        </div>
      </div>

      {errorMessage ? (
        <div
          className={`GeekieImage-ErrorMessage ${defaultTheme.errorMessage}`}
        >
          <svg
            width="12"
            height="10"
            viewBox="0 0 12 10"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              marginRight: 3,
            }}
          >
            <path
              d="M0.5 9.5H11.5L6 0L0.5 9.5ZM6.5 8H5.5V7H6.5V8ZM6.5 6H5.5V4H6.5V6Z"
              fill="#D93734"
            />
          </svg>

          {errorMessage}
        </div>
      ) : null}

      <div
        className={`GeekieImage-SelectImageButtonGroup ${defaultTheme.selectImageButtonGroup}`}
      >
        <div
          className={`GeekieImage-SelectImageButton ${
            defaultTheme.selectImageButton
          } ${
            !candidateImage
              ? `GeekieImage-SelectImageButton--disabled ${defaultTheme.selectImageButtonDisabled}`
              : ''
          }`}
          onClick={() => {
            handleSubmit();
          }}
        >
          Ok
        </div>
        <div
          className={`GeekieImage-SelectImageButton ${defaultTheme.selectImageButton}`}
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
    <span
      className={`GeekieImage-SelectImageControlContainer ${defaultTheme.selectImageControlContainer}`}
      ref={panelRef}
    >
      <button
        className={`Draftail-ToolbarButton ${
          showFileDropPanel ? 'Draftail-ToolbarButton--active' : ''
        }`}
        aria-label={buttonTooltipText}
        data-draftail-balloon={buttonTooltipText}
        onClick={() => {
          setShowFileDropPanel(!showFileDropPanel);
        }}
      >
        <span className="Draftail-ToolbarButton__label">
          <SelectImageIcon />
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
