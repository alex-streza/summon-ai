import imageCompression from "browser-image-compression";
import Compressor from "compressorjs";

export const convertDataURIToBinary = (dataURI: string) =>
  Uint8Array.from(window.atob(dataURI.replace(/^data[^,]+,/, "")), (v) =>
    v.charCodeAt(0)
  );

export const urltoFile = (url: string, filename: string, mimeType: string) => {
  return fetch(url)
    .then(function (res) {
      return res.arrayBuffer();
    })
    .then(function (buf) {
      return new File([buf], filename, { type: mimeType });
    });
};

export const urlToBlob = async (url: string) => {
  const data = await fetch(url);
  const blob = await data.blob();

  return blob;
};

export const fileToBase64 = async (file: File) => {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data);
    };
  });
};

export const urlToBase64 = async (url: string) => {
  const data = await fetch(url);
  const blob = await data.blob();

  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.readAsDataURL(blob);
    reader.onloadend = () => {
      const base64data = reader.result as string;
      resolve(base64data);
    };
  });
};

export const getImagePaint = (
  node: any,
  size?: number,
  ignoreSize?: boolean
) => {
  const paint = (node.fills as ImagePaint[])[0];
  if (
    (!size || (size == node.width && size == node.height)) &&
    (node.width === node.height || ignoreSize) &&
    paint.type === "IMAGE" &&
    paint.scaleMode === "FILL" &&
    paint.imageHash
  ) {
    return paint;
  }
};

export const convertToBytes = async (node: SceneNode, ignoreSize?: boolean) => {
  // Look for fills on node types that have fills.
  // An alternative would be to do `if ('fills' in node) { ... }
  switch (node.type) {
    case "RECTANGLE":
    case "ELLIPSE":
    case "POLYGON":
    case "STAR":
    case "VECTOR":
    case "TEXT": {
      const paint = getImagePaint(node, undefined, ignoreSize);
      if (paint && paint.imageHash) {
        const image = figma.getImageByHash(paint.imageHash);

        if (image) {
          const bytes = await image.getBytesAsync();

          return bytes;
        }
      }
      break;
    }

    default: {
      // not supported, silently do nothing
    }
  }
};

export const compressImage = async (image: File) => {
  console.log("originalFile instanceof Blob", image instanceof Blob); // true
  console.log(`originalFile size ${image.size / 1024 / 1024} MB`);

  const options = {
    // maxSizeMB: 1,
    // maxWidthOrHeight: 1920,
    // useWebWorker: false,
  };
  try {
    const compressedImage = await imageCompression(image, options);
    console.log(
      "compressedFile instanceof Blob",
      compressedImage instanceof Blob
    ); // true
    console.log(`compressedFile size ${compressedImage.size / 1024 / 1024} MB`); // smaller than maxSizeMB
    return compressedImage;
  } catch (error) {
    console.log(error);
  }

  return image;
};

export const compressImage2 = async (
  image: File,
  success: (image: File) => void
) =>
  new Compressor(image, {
    quality: 0.6,
    // The compression process is asynchronous,
    // which means you have to access the `result` in the `success` hook function.
    success,
  });
