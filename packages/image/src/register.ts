export const pluginConfig = {
  fileLimitation: 5, // file size limitation in unit MB
};

export const setFileLimitation = (limitation: number): void => {
  pluginConfig.fileLimitation = limitation;
};

type ImageSizeWarningCallback = (() => void) | null;
let imageSizeWarning: ImageSizeWarningCallback = null;
export const registerImageSizeWarningCallback = (
  callback: ImageSizeWarningCallback
): void => {
  imageSizeWarning = callback;
};
export const getImageSizeWarningCallback: () => ImageSizeWarningCallback = () =>
  imageSizeWarning;

type UploadImageTask = (file: File) => Promise<string>;
const defaultUploadImage: UploadImageTask = () =>
  Promise.reject(
    new Error('should register the uploadImageTask before uploading image')
  );

let uploadImage: UploadImageTask = defaultUploadImage;
export const getUploadImage: () => UploadImageTask = () => uploadImage;

export const registerUploadImageTask: (
  newUploadImage: UploadImageTask
) => void = (newUploadImage) => {
  if (typeof newUploadImage !== 'function') {
    throw Error('should pass a valid UploadImageTask');
  } else {
    uploadImage = newUploadImage;
  }
};
