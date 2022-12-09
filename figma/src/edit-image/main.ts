import {
  emit,
  loadSettingsAsync,
  on,
  once,
  saveSettingsAsync,
  showUI,
} from "@create-figma-plugin/utilities";
import { RESOLUTIONS } from "../constants/config";
import { convertToBytes, getImagePaint } from "../utils/image";
import { pasteImages } from "../utils/pasteImages";

import { CloseHandler, ExportHandler } from "./types";

export default function () {
  on<ExportHandler>("EXPORT", function (img, prompt, token) {
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

      saveSettingsAsync({ token });

      figma.notify("🎉 Edited image succesful! 🎉");
    });
  });

  once<CloseHandler>("CLOSE", function () {
    figma.closePlugin();
  });

  on("NOTIFY", figma.notify);

  on("SAVE_SETTINGS", (settings) => {
    saveSettingsAsync(settings);
    figma.notify("Settings saved!");
  });

  on("CLEAR_SETTINGS", () => {
    saveSettingsAsync({ user: figma.currentUser });
    figma.notify("Settings cleared!");
  });

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

  if (selection && getImagePaint(selection, 1024)) {
    loadSettingsAsync({}).then((settings) => {
      emit("LOAD_SETTINGS", { ...settings, user: figma.currentUser });
    });

    showUI({
      width: 560,
      height: 800,
    });
  } else {
    figma.notify("Please select a 1024x1024 resolution image");
    figma.closePlugin();
  }
}
