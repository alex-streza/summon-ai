import { emit, on, showUI } from "@create-figma-plugin/utilities";
import { convertToBytes, getImagePaint } from "./../utils/image";

import {
  loadSettingsAsync,
  saveSettingsAsync,
} from "@create-figma-plugin/utilities";
import { pasteImages } from "../utils/pasteImages";
import registerCommonEvents from "../utils/registerCommonEvents";
import { GenerateHandler } from "./types";
import { LoadSettingsHandler, SelectImageHandler } from "../types";

export default function () {
  on<GenerateHandler>("GENERATE", function (resolution, images, openAIToken) {
    Promise.all([
      figma.loadFontAsync({ family: "Inter", style: "Regular" }),
      figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
      figma.loadFontAsync({ family: "Inter", style: "Bold" }),
    ]).then(() => {
      pasteImages({
        resolution,
        images,
        pasteCenterViewport: true,
      });

      saveSettingsAsync({ openAIToken });

      emit<LoadSettingsHandler>("LOAD_SETTINGS", {
        openAIToken,
      });

      figma.notify("🎉 Generated " + images.length + " variants! 🎉");
    });
  });

  registerCommonEvents();

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
          emit<SelectImageHandler>("SELECT_IMAGE", figma.base64Encode(image));
        }
      });
    }
  }, 500);

  if (selection && getImagePaint(selection)) {
    loadSettingsAsync({}).then((settings) => {
      emit<LoadSettingsHandler>("LOAD_SETTINGS", {
        ...settings,
        user: figma.currentUser,
      });
    });

    showUI({
      height: 540,
      width: 600,
    });
  } else {
    figma.notify("Please select a square resolution image (ex. 1024x1024)");
    figma.closePlugin();
  }
}
