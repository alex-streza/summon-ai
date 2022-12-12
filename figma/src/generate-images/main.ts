import {
  on,
  emit,
  saveSettingsAsync,
  showUI,
} from "@create-figma-plugin/utilities";
import { LoadSettingsHandler } from "../types";
import { pasteImages } from "../utils/pasteImages";
import registerCommonEvents from "../utils/registerCommonEvents";

import { GenerateHandler } from "./types";

export default function () {
  on<GenerateHandler>("GENERATE", function (prompt, resolution, images, token) {
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

      saveSettingsAsync({ token });

      emit<LoadSettingsHandler>("LOAD_SETTINGS", {
        token,
      });

      figma.notify("🎉 Generated " + images.length + " images! 🎉");
    });
  });

  registerCommonEvents();

  showUI({
    height: 520,
    width: 600,
  });
}
