import {
  emit,
  loadSettingsAsync,
  on,
  saveSettingsAsync,
  showUI,
} from "@create-figma-plugin/utilities";
import { RESOLUTIONS } from "../constants/config";
import { convertToBytes, getImagePaint } from "../utils/image";
import { pasteImages } from "../utils/pasteImages";
import registerCommonEvents from "../utils/registerCommonEvents";
import { LoadSettingsHandler, SelectImageHandler } from "./../types/index";

import { ExportHandler } from "./types";

export default function () {
  on<ExportHandler>("EXPORT", function (img, prompt, openAIToken) {
    Promise.all([
      figma.loadFontAsync({ family: "Inter", style: "Regular" }),
      figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
      figma.loadFontAsync({ family: "Inter", style: "Bold" }),
    ]).then(() => {
      pasteImages({
        prompt,
        images: [img],
        resolution: RESOLUTIONS[2],
        pasteCenterViewport: true,
      });

      saveSettingsAsync({ openAIToken });

      emit<LoadSettingsHandler>("LOAD_SETTINGS", {
        openAIToken,
      });

      figma.notify("🎉 Edited image succesful! 🎉");
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

  if (selection && getImagePaint(selection, 1024)) {
    loadSettingsAsync({}).then((settings) => {
      emit<LoadSettingsHandler>("LOAD_SETTINGS", {
        ...settings,
        user: figma.currentUser,
      });
    });

    showUI({
      width: 600,
      height: 800,
    });
  } else {
    figma.notify("Please select a 1024x1024 resolution image");
    figma.closePlugin();
  }
}
