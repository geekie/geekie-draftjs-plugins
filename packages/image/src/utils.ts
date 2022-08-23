import { pluginConfig } from './register';

const ACCEPTED_MIMES = ['image/png', 'image/jpeg', 'image/gif'];
const MAX_IMAGE_DIMENSION_PX = 500;

type Size = {
  width: number;
  height: number;
};

type GetAcceptableSizeProps = Size & {
  maxDimension?: number;
};

export const getAcceptableSize = ({
  width,
  height,
  maxDimension,
}: GetAcceptableSizeProps): Size => {
  const max = maxDimension || MAX_IMAGE_DIMENSION_PX;
  let limitWidth = width;
  let limitHeight = height;
  const ratio = width / height;
  if (ratio > 1) {
    if (width > max) {
      limitWidth = max;
      limitHeight = limitWidth / ratio;
    }
  } else {
    if (height > max) {
      limitHeight = max;
      limitWidth = limitHeight * ratio;
    }
  }
  return { width: limitWidth, height: limitHeight };
};

export const getHeightAndWidthFromDataUrl = (dataURL: string): Promise<Size> =>
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

export const isValidImageType = (file: File): boolean =>
  ACCEPTED_MIMES.includes(file.type);

export const isValidImageSize = (file: File): boolean =>
  file.size <= pluginConfig.fileLimitation * 1024 * 1024;
