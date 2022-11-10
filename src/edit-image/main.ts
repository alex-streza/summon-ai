import { emit, once, showUI } from "@create-figma-plugin/utilities";

import { CloseHandler, ExportHandler } from "./types";

const getImagePaint = (node: any) => {
	const paint = (node.fills as ImagePaint[])[0];
	if (
		node.width === 512 &&
		node.height === 512 &&
		paint.type === "IMAGE" &&
		paint.scaleMode === "FILL" &&
		paint.imageHash
	) {
		return paint;
	}
};

async function convertToBytes(node: SceneNode) {
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
}

export default function () {
	once<ExportHandler>("EXPORT", function (img) {
		Promise.all([
			figma.loadFontAsync({ family: "Inter", style: "Regular" }),
			figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
		]).then(() => {
			const nodes: SceneNode[] = [];

			const IMAGE_SIZE = 512;
			const GAP = IMAGE_SIZE / 8;
			const TEXT_SIZE = IMAGE_SIZE / 16;

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

			const gapOffset = (GAP * (nodes.length - 1)) / 2;
			const nodesOffset = (IMAGE_SIZE / 2) * nodes.length;

			if (figma.currentPage.selection.length > 0) {
				const middleX = figma.viewport.center.x - nodesOffset - gapOffset;
				const middleY = figma.viewport.center.y - IMAGE_SIZE / 2;

				nodes.forEach((node, index) => {
					node.x = middleX + (IMAGE_SIZE + GAP) * index;
					node.y = middleY;

					const text = figma.createText();
					text.characters = "V" + (index + 1);
					text.fontSize = TEXT_SIZE;
					text.fontName = { family: "Inter", style: "Bold" };

					text.x = node.x + node.width / 2 - text.width / 2;
					text.y = node.y + node.height + TEXT_SIZE;

					nodes.push(text);

					figma.currentPage.appendChild(node);
					figma.currentPage.appendChild(text);
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

			figma.notify("🎉 Edited image succesful! 🎉");
		});
	});

	once<CloseHandler>("CLOSE", function () {
		figma.closePlugin();
	});

	let selection = figma.currentPage.selection[0];
	let loaded = false;

	setInterval(() => {
		const currentSelection = figma.currentPage.selection[0];
		if (currentSelection && (currentSelection.id !== selection?.id || !loaded)) {
			selection = currentSelection;
			loaded = true;
			convertToBytes(selection).then((image) => {
				if (image) {
					emit("SELECT_IMAGE", {
						image: figma.base64Encode(image),
					});
				}
			});
		}
	}, 500);

	if (selection && getImagePaint(selection)) {
		showUI({
			height: 800,
			width: 554,
		});
	} else {
		figma.notify("Please select a 512x512 resolution image");
		figma.closePlugin();
	}
}
