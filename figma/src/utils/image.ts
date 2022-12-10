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

export const getImagePaint = (node: any, size?: number) => {
  const paint = (node.fills as ImagePaint[])[0];
  if (
    (!size || (size == node.width && size == node.height)) &&
    node.width === node.height &&
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
