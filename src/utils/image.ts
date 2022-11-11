import { RESOLUTIONS_NUMBER } from "../constants/config";

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

export const getImagePaint = (node: any) => {
  const paint = (node.fills as ImagePaint[])[0];
  if (
    RESOLUTIONS_NUMBER.some(
      (resolution) => resolution === node.width && resolution === node.height
    ) &&
    paint.type === "IMAGE" &&
    paint.scaleMode === "FILL" &&
    paint.imageHash
  ) {
    return paint;
  }
};

export const convertToBytes = async (node: SceneNode) => {
  // Look for fills on node types that have fills.
  // An alternative would be to do `if ('fills' in node) { ... }
  switch (node.type) {
    case "RECTANGLE":
    case "ELLIPSE":
    case "POLYGON":
    case "STAR":
    case "VECTOR":
    case "TEXT": {
      const paint = getImagePaint(node);
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
