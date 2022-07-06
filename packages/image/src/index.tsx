import React, { ComponentType, ReactElement } from 'react';
import { EditorPlugin } from '@draft-js-plugins/editor';
import addImage from './modifiers/addImage';
import ImageComponent, { ImageProps } from './Image';
import { control, SelectImageControl } from './SelectImageControl';
import { defaultTheme } from './theme';

export interface ImagePluginConfig {
  decorator?(component: ComponentType<ImageProps>): ComponentType<ImageProps>;
  imageComponent?: ComponentType<ImageProps>;
}

export type ImageEditorPlugin = EditorPlugin & {
  addImage: typeof addImage;
  control: SelectImageControl;
};

export default (config: ImagePluginConfig = {}): ImageEditorPlugin => {
  const theme = defaultTheme;

  let Image = config.imageComponent || ImageComponent;

  if (config.decorator) {
    Image = config.decorator(Image);
  }

  const ThemedImage = (props: ImageProps): ReactElement => (
    <Image {...props} theme={theme} />
  );

  return {
    blockRendererFn: (block, { getEditorState }) => {
      if (block.getType() === 'atomic') {
        const contentState = getEditorState().getCurrentContent();
        const entity = block.getEntityAt(0);
        if (!entity) return null;
        const type = contentState.getEntity(entity).getType();
        if (type === 'IMAGE' || type === 'image') {
          return {
            component: ThemedImage,
            editable: false,
          };
        }
        return null;
      }

      return null;
    },
    addImage,
    control,
  };
};

export const Image = ImageComponent;
