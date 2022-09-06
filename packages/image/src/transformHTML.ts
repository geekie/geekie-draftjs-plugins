import { MAX_IMAGE_INITIAL_DIMENSION_PX } from './constants';

type TransformImageEntity = {
  type: string;
  mutability: string;
  data: {
    height: number;
    width: number;
    src: string;
  };
};

const imageTypeAttributeLabel = 'data-geekie-image';
const setDataAttribute = (key: string, value: string): string =>
  `data-${key}="${value}"`;
const getDataAttribute = (node: HTMLElement, key: string): string | null =>
  node.getAttribute(`data-${key}`);

export const imageEntityToHTML = (
  entity: TransformImageEntity
): string | undefined => {
  if (entity.type === 'GEEKIE_IMAGE' && entity.data) {
    const { height, width, src } = entity.data;

    return `<img src="${src}" ${imageTypeAttributeLabel} ${setDataAttribute(
      'width',
      `${width}`
    )} ${setDataAttribute(
      'height',
      `${height}`
    )} style="height: ${height}px;width: ${width}px" />`;
  }

  return undefined;
};

export const htmlToImageEntity = (
  nodeName: string,
  node: HTMLImageElement
): TransformImageEntity | undefined => {
  if (nodeName === 'img' && node.hasAttribute(imageTypeAttributeLabel)) {
    const maxImageInitialDimension = MAX_IMAGE_INITIAL_DIMENSION_PX.toString();
    return {
      type: 'GEEKIE_IMAGE',
      mutability: 'IMMUTABLE',
      data: {
        src: node.getAttribute('src') || '',
        height: parseFloat(
          getDataAttribute(node, 'height') || maxImageInitialDimension
        ),
        width: parseFloat(
          getDataAttribute(node, 'width') || maxImageInitialDimension
        ),
      },
    };
  }

  return undefined;
};
