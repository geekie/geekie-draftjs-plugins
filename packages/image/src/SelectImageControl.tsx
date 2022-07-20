import { EditorState } from 'draft-js';
import React, { ChangeEventHandler, useRef, useState } from 'react';
import { useClickAway, useDropArea } from 'react-use';
import addImage from './modifiers/addImage';
import { getUploadImage, pluginConfig } from './register';
import { SelectImageIcon } from './SelectImageIcon';
import { defaultTheme } from './theme';

interface DraftToolbarControlProps {
  getEditorState: () => EditorState;
  onChange: (state: EditorState) => void;
}

export type SelectImageControl = React.ComponentType<DraftToolbarControlProps>;

const getHeightAndWidthFromDataUrl = (
  dataURL: string
): Promise<{ width: number; height: number }> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({
        height: img.height,
        width: img.width,
      });
    };
    img.src = dataURL;
  });

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
    if (candidateImage) {
      const editorState = getEditorState();
      const { width, height } = await getHeightAndWidthFromDataUrl(
        candidateImage
      );

      // Limit image size by 500px
      let limitWidth = width;
      let limitHeight = height;
      const ratio = width / height;
      if (ratio > 1) {
        if (width > 500) {
          limitWidth = 500;
          limitHeight = limitWidth / ratio;
        }
      } else {
        if (height > 500) {
          limitHeight = 500;
          limitWidth = limitHeight * ratio;
        }
      }

      const newEditorState = addImage(editorState, candidateImage, {
        width: limitWidth,
        height: limitHeight,
        x: 0,
        y: 0,
      });
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
      // Check file size limitation
      if (file.size > pluginConfig.fileLimitation * 1024 * 1024) {
        setErrorMessage(
          `Insira uma imagem menor que ${pluginConfig.fileLimitation}MB`
        );
        return;
      }
      setErrorMessage(null);

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

      {errorMessage ? (
        <div className={defaultTheme.errorMessage}>
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
