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

export const uploadImages = async (
  images: {
    b64: string;
    filename: string;
  }[]
) => {
  const res = await fetch(
    "http://localhost:3000/api/images/upload-url?count=" + images.length,
    {
      method: "GET",
    }
  );
  const data = await res.json();

  for (let i = 0; i < images.length; i++) {
    const { b64, filename } = images[i];

    const formData = new FormData();
    formData.append("file", await urltoFile(b64, filename, "image/png"));

    fetch(data.urls[i], {
      method: "POST",
      mode: "no-cors",
      body: formData,
    });
  }
};
