//const defaultUploadImage: UploadImageTask = () =>
//Promise.reject(
//new Error('should register the uploadImageTask before uploading image')
//);

const defaultUploadImage: UploadImageTask = async () =>
  Promise.resolve('https://picsum.photos/1000/700');

type UploadImageTask = (file: File) => Promise<string>;

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
