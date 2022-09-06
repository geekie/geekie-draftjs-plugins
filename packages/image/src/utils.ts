import { ACCEPTED_MIMES, MAX_IMAGE_INITIAL_DIMENSION_PX } from './constants';
import { pluginConfig } from './register';

type Dimensions = {
  width: number;
  height: number;
};

type GetAcceptableSizeProps = Dimensions & {
  maxDimension?: number;
};

export const getAcceptableSize = ({
  width,
  height,
  maxDimension,
}: GetAcceptableSizeProps): Dimensions => {
  const max = maxDimension || MAX_IMAGE_INITIAL_DIMENSION_PX;
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

export const getHeightAndWidthFromDataUrl = (
  dataURL: string
): Promise<Dimensions> =>
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
