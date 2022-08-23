import React, { ComponentType, ReactElement } from 'react';
import { ContentBlock, EditorState } from 'draft-js';
import { EditorPlugin } from '@draft-js-plugins/editor';
import addImage, { IMAGE_ENTITY_TYPE } from './modifiers/addImage';
import ImageComponent, { ImageProps } from './Image';
import { control, SelectImageControl } from './SelectImageControl';
import { defaultTheme } from './theme';
import { setFileLimitation } from './register';

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

const ACCEPTED_MIMES = ['image/png', 'image/jpeg', 'image/gif'];

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
      if (block.getType() === 'atomic') {
        const contentState = getEditorState().getCurrentContent();
        const entity = block.getEntityAt(0);
        if (!entity) return null;
        const type = contentState.getEntity(entity).getType();
        const resizeData = contentState.getEntity(entity).getData();

        if (type === IMAGE_ENTITY_TYPE) {
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
        }
        return null;
      }

      return null;
    },
    handlePastedFiles(e, editor) {
      const editorState = editor.getEditorState();
      if (e.length !== 1) return;
      const image = e[0];
      if (ACCEPTED_MIMES.indexOf(image.type) < 0) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target.result;
        const newEditorState = addImage(editorState, url, {
          width: 500,
          height: 500
        });
        editor.setEditorState(newEditorState);
      };
      reader.readAsDataURL(image);
    },
    addImage,
    control,
    entityType: {
      type: IMAGE_ENTITY_TYPE,
    },
  };
};

export const Image = ImageComponent;
