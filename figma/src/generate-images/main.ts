import {
  emit,
  loadSettingsAsync,
  on,
  once,
  saveSettingsAsync,
  showUI,
} from "@create-figma-plugin/utilities";
import { pasteImages } from "../utils/pasteImages";

import { CloseHandler, GenerateHandler } from "./types";

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

  once<CloseHandler>("CLOSE", function () {
    figma.closePlugin();
  });

  on("NOTIFY", figma.notify);

  loadSettingsAsync({}).then((settings) => {
    emit("LOAD_SETTINGS", settings);
  });

  showUI({
    height: 520,
    width: 600,
  });
}
