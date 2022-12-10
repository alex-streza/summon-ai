import { on, saveSettingsAsync, showUI } from "@create-figma-plugin/utilities";
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

      figma.notify("🎉 Generated " + images.length + " images! 🎉");
    });
  });

  registerCommonEvents();

  showUI({
    height: 520,
    width: 600,
  });
}
