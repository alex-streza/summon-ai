import {
  on,
  emit,
  saveSettingsAsync,
  showUI,
  loadSettingsAsync,
} from "@create-figma-plugin/utilities";
import { LoadSettingsHandler, SelectImageHandler } from "../types";
import { convertToBytes } from "../utils/image";
import { pasteImages } from "../utils/pasteImages";
import registerCommonEvents from "../utils/registerCommonEvents";

import { GenerateHandler } from "./types";

export default function () {
  on<GenerateHandler>("GENERATE", function (prompt, resolution, images) {
    Promise.all([
      figma.loadFontAsync({ family: "Inter", style: "Regular" }),
      figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
      figma.loadFontAsync({ family: "Inter", style: "Bold" }),
    ]).then(() => {
      pasteImages({
        prompt,
        resolution,
        images,
      });

      figma.notify("🎉 Generated " + images.length + " images! 🎉");
    });
  });

  let selection = figma.currentPage.selection[0];

  setInterval(() => {
    const currentSelection = figma.currentPage.selection[0];
    if (currentSelection && currentSelection.id !== selection?.id) {
      selection = currentSelection;
      convertToBytes(selection, true).then((image) => {
        if (image) {
          emit<SelectImageHandler>("SELECT_IMAGE", figma.base64Encode(image));
        }
      });
    }
  }, 500);

  registerCommonEvents();

  showUI({
    height: 520,
    width: 600,
  });
}
