export const pasteImages = ({
  prompt,
  resolution = "256x256",
  images,
  pasteCenterViewport,
  hideVariant,
}: {
  prompt?: string;
  resolution?: string;
  images: Array<Uint8Array>;
  pasteCenterViewport?: boolean;
  hideVariant?: boolean;
}) => {
  const nodes: SceneNode[] = [];

  const IMAGE_SIZE = resolution.split("x").map((x) => parseInt(x))[0];
  const GAP = IMAGE_SIZE / 8;
  const TITLE_SIZE = IMAGE_SIZE / 12;
  const TEXT_SIZE = IMAGE_SIZE / 16;

  images.forEach((img: Uint8Array) => {
    const node = figma.createRectangle();
    const image = figma.createImage(img);

    node.resize(IMAGE_SIZE, IMAGE_SIZE);
    node.fills = [
      {
        imageHash: image.hash,
        scaleMode: "FILL",
        scalingFactor: 0.5,
        type: "IMAGE",
      },
    ];
    nodes.push(node);
    figma.currentPage.appendChild(node);
  });

  const gapOffset = (GAP * (nodes.length - 1)) / 2;
  const nodesOffset = (IMAGE_SIZE / 2) * nodes.length;

  if (figma.currentPage.selection.length > 0 && !pasteCenterViewport) {
    const frames = figma.currentPage.selection.filter(
      (node) => node.type === "FRAME"
    ) as FrameNode[];
    const nonFrames = figma.currentPage.selection.filter(
      (node) => node.type !== "FRAME"
    ) as SceneNode[];

    if (frames.length > 0) {
      const middleX = frames[0].width / 2 - nodesOffset - gapOffset;
      const middleY = frames[0].height / 2 - IMAGE_SIZE / 2;

      nodes.forEach((node, index) => {
        node.x = middleX + (IMAGE_SIZE + GAP) * index;
        node.y = middleY;

        if (!hideVariant) {
          const text = figma.createText();
          text.characters = "V" + (index + 1);
          text.fontSize = TEXT_SIZE;
          text.fontName = { family: "Inter", style: "Bold" };

          text.x = node.x + node.width / 2 - text.width / 2;
          text.y = node.y + node.height + 20;

          frames[0].appendChild(node);
          frames[0].appendChild(text);
          nodes.push(text);
        }

        if (index === 0 && prompt) {
          const promptText = figma.createText();
          promptText.characters = prompt;
          promptText.fontSize = TITLE_SIZE;
          promptText.textAlignHorizontal = "CENTER";
          promptText.fontName = { family: "Inter", style: "Semi Bold" };
          promptText.resize(1000, promptText.height);

          promptText.x = frames[0].width / 2 - promptText.width / 2;
          promptText.y =
            frames[0].height / 2 - promptText.height / 2 - 100 - IMAGE_SIZE / 2;

          frames[0].appendChild(promptText);
          nodes.push(promptText);
        }
      });
    } else {
      const middleX =
        nonFrames[0].x + nonFrames[0].width / 2 - nodesOffset - gapOffset;
      const middleY = nonFrames[0].y + nonFrames[0].height / 2 - IMAGE_SIZE / 2;

      nodes.forEach((node, index) => {
        node.x = middleX + (IMAGE_SIZE + GAP) * index;
        node.y = middleY;

        if (!hideVariant) {
          const text = figma.createText();
          text.characters = "V" + (index + 1);
          text.fontSize = TEXT_SIZE;
          text.fontName = { family: "Inter", style: "Bold" };

          text.x = node.x + node.width / 2 - text.width / 2;
          text.y = node.y + node.height + 20;
          nodes.push(text);
        }

        if (index === 0 && prompt) {
          const promptText = figma.createText();
          promptText.characters = prompt;
          promptText.fontSize = TITLE_SIZE;
          promptText.textAlignHorizontal = "CENTER";
          promptText.fontName = { family: "Inter", style: "Semi Bold" };
          promptText.resize(1000, promptText.height);

          promptText.x =
            nonFrames[0].x + nonFrames[0].width / 2 - promptText.width / 2;
          promptText.y =
            nonFrames[0].y +
            nonFrames[0].height / 2 -
            promptText.height / 2 -
            150 -
            IMAGE_SIZE / 2;

          figma.currentPage.appendChild(promptText);
          nodes.push(promptText);
        }
      });
    }
  } else {
    const middleX = figma.viewport.center.x - nodesOffset - gapOffset;
    const middleY = figma.viewport.center.y - IMAGE_SIZE / 2;

    nodes.forEach((node, index) => {
      node.x = middleX + (IMAGE_SIZE + GAP) * index;
      node.y = middleY;

      if (!hideVariant) {
        const text = figma.createText();
        text.characters = "V" + (index + 1);
        text.fontSize = TEXT_SIZE;
        text.fontName = { family: "Inter", style: "Bold" };

        text.x = node.x + node.width / 2 - text.width / 2;
        text.y = node.y + node.height + TEXT_SIZE;
        nodes.push(text);
        figma.currentPage.appendChild(node);
        figma.currentPage.appendChild(text);
      }

      if (index === 0 && prompt) {
        const promptText = figma.createText();
        promptText.characters = prompt;
        promptText.fontSize = TITLE_SIZE;
        promptText.textAlignHorizontal = "CENTER";
        promptText.fontName = { family: "Inter", style: "Semi Bold" };
        promptText.resize(1000, promptText.height);

        promptText.x = figma.viewport.center.x - promptText.width / 2;
        promptText.y =
          figma.viewport.center.y -
          promptText.height / 2 -
          150 -
          IMAGE_SIZE / 2;

        figma.currentPage.appendChild(promptText);
        nodes.push(promptText);
      }
    });
  }

  nodes.forEach((node) => {
    if (node.type === "TEXT")
      (node as TextNode).fills = [
        {
          type: "SOLID",
          color: {
            r: 0.2,
            g: 0.2,
            b: 0.2,
          },
        },
      ];
  });

  figma.currentPage.selection = nodes;
  figma.viewport.scrollAndZoomIntoView(nodes);
};
