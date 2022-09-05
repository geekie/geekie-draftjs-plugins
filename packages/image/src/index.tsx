import { ContentBlock, EditorState } from 'draft-js';
import React, { ComponentType, ReactElement } from 'react';
import { EditorPlugin } from '../../editor/src';
import ImageComponent, { ImageProps } from './Image';
import addImage, { IMAGE_ENTITY_TYPE } from './modifiers/addImage';
import removeImage from './modifiers/removeImage';
import { getUploadImage, setFileLimitation } from './register';
import { control, SelectImageControl } from './SelectImageControl';
import { defaultTheme } from './theme';
import {
  getAcceptableSize,
  getHeightAndWidthFromDataUrl,
  isValidImageSize,
  isValidImageType,
} from './utils';

export { registerUploadImageTask, setFileLimitation } from './register';
export { htmlToImageEntity, imageEntityToHTML } from './transformHTML';

export interface ImagePluginConfig {
  imageSizeLimitation?: number;
  decorator?(component: ComponentType<ImageProps>): ComponentType<ImageProps>;
  imageComponent?: ComponentType<ImageProps>;
}

export type ImageEditorPlugin = EditorPlugin & {
  addImage: typeof addImage;
  control: SelectImageControl;
  entityType: {
    type: string;
  };
};

const createSetResizeData =
  (
    contentBlock: ContentBlock,
    {
      getEditorState,
      setEditorState,
    }: {
      getEditorState(): EditorState;
      setEditorState(state: EditorState): void;
    }
  ) =>
  (data: Record<string, unknown>) => {
    const entityKey = contentBlock.getEntityAt(0);
    if (entityKey) {
      const editorState = getEditorState();
      const contentState = editorState.getCurrentContent();
      contentState.mergeEntityData(entityKey, { ...data });
      setEditorState(
        EditorState.forceSelection(editorState, editorState.getSelection())
      );
    }
  };

export default (config: ImagePluginConfig = {}): ImageEditorPlugin => {
  const theme = defaultTheme;

  let Image = config.imageComponent || ImageComponent;

  if (config.decorator) {
    Image = config.decorator(Image);
  }

  if (typeof config.imageSizeLimitation === 'number') {
    setFileLimitation(config.imageSizeLimitation);
  }

  const ThemedImage = (props: ImageProps): ReactElement => (
    <Image {...props} theme={theme} />
  );

  let focusedBlock: ContentBlock | null = null;

  return {
    blockRendererFn: (block, { getEditorState, setEditorState }) => {
      if (block.getType() !== 'atomic') return null;
      const contentState = getEditorState().getCurrentContent();
      const entity = block.getEntityAt(0);
      if (!entity) return null;
      const type = contentState.getEntity(entity).getType();
      const resizeData = contentState.getEntity(entity).getData();
      if (type !== IMAGE_ENTITY_TYPE) return null;
      return {
        component: ThemedImage,
        editable: false,
        props: {
          resizeData,
          onChangeFocus: (isFocus: boolean) => {
            focusedBlock = isFocus ? block : null;
          },
          setResizeData: createSetResizeData(block, {
            getEditorState,
            setEditorState,
          }),
        },
      };
    },
    handlePastedFiles: (files: File[], { getEditorState, setEditorState }) => {
      if (
        !files.length ||
        !isValidImageType(files[0]) ||
        !isValidImageSize(files[0])
      )
        return 'handled';
      getUploadImage()(files[0]).then(async (dataURL) => {
        const originalSize = await getHeightAndWidthFromDataUrl(dataURL);
        const acceptableSize = getAcceptableSize(originalSize);
        setEditorState(addImage(getEditorState(), dataURL, acceptableSize));
      });
      return 'handled';
    },
    keyBindingFn(event, { getEditorState, setEditorState }) {
      if (event.key !== 'Backspace' || !focusedBlock) return undefined;
      const editorState = getEditorState();
      const newEditorState = removeImage(editorState, focusedBlock.getKey());
      setEditorState(newEditorState);
      return 'handled';
    },
    addImage,
    control,
    entityType: { type: IMAGE_ENTITY_TYPE },
  };
};

export const Image = ImageComponent;
