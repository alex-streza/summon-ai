import {
  emit,
  loadSettingsAsync,
  on,
  once,
  saveSettingsAsync,
  showUI,
} from "@create-figma-plugin/utilities";
import { convertToBytes, getImagePaint } from "../utils/image";
import { pasteImages } from "../utils/pasteImages";

import { CloseHandler, ExportHandler } from "./types";

export default function () {
  once<ExportHandler>("EXPORT", function (img, prompt, token) {
    Promise.all([
      figma.loadFontAsync({ family: "Inter", style: "Regular" }),
      figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
      figma.loadFontAsync({ family: "Inter", style: "Bold" }),
    ]).then(() => {
      pasteImages({
        prompt,
        images: [img],
        pasteCenterViewport: true,
      });

      saveSettingsAsync({ token });

      figma.notify("🎉 Edited image succesful! 🎉");
    });
  });

  once<CloseHandler>("CLOSE", function () {
    figma.closePlugin();
  });

  on("NOTIFY", figma.notify);

  let selection = figma.currentPage.selection[0];
  let loaded = false;

  setInterval(() => {
    const currentSelection = figma.currentPage.selection[0];
    if (
      currentSelection &&
      (currentSelection.id !== selection?.id || !loaded)
    ) {
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
    loadSettingsAsync({}).then((settings) => {
      emit("LOAD_SETTINGS", settings);
    });

    showUI({
      height: 1512,
      width: 1064,
    });
  } else {
    figma.notify("Please select a square resolution image (ex. 1024x1024)");
    figma.closePlugin();
  }
}
