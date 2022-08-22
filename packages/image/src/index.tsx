import React, { ComponentType, ReactElement } from 'react';
import { ContentBlock, EditorState } from 'draft-js';
import { EditorPlugin } from '../../editor/src';
import addImage, { IMAGE_ENTITY_TYPE } from './modifiers/addImage';
import ImageComponent, { ImageProps } from './Image';
import { control, SelectImageControl } from './SelectImageControl';
import { defaultTheme } from './theme';
import { getUploadImage, setFileLimitation } from './register';
import { getAcceptableSize, getHeightAndWidthFromDataUrl, isValidImageSize, isValidImageType } from './utils';

export { registerUploadImageTask, setFileLimitation } from './register';

export { imageEntityToHTML, htmlToImageEntity } from './transformHTML';

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
          setResizeData: createSetResizeData(block, {
            getEditorState,
            setEditorState,
          }),
        },
      };
    },
    handlePastedFiles: (files: File[], { getEditorState, setEditorState }) => {
      if (!files.length || !isValidImageType(files[0]) || !isValidImageSize(files[0])) return 'handled';
      getUploadImage()(files[0]).then(async (dataURL) => {
        const originalSize = await getHeightAndWidthFromDataUrl(dataURL);
        const acceptableSize = getAcceptableSize(originalSize);
        setEditorState(addImage(getEditorState(), dataURL, acceptableSize));
      })
      return 'handled';
    },
    addImage,
    control,
    entityType: { type: IMAGE_ENTITY_TYPE, }
  };
};

export const Image = ImageComponent;
