import {
  emit,
  loadSettingsAsync,
  on,
  once,
  saveSettingsAsync,
} from "@create-figma-plugin/utilities";
import {
  ClearSettingsHandler,
  CloseHandler,
  DownloadHandler,
  LoadSettingsHandler,
  NotifyHandler,
  SaveSettingsHandler,
} from "../types";
import { pasteImages } from "../utils/pasteImages";

export default function () {
  once<CloseHandler>("CLOSE", function () {
    figma.closePlugin();
  });

  on<NotifyHandler>("NOTIFY", figma.notify);

  on<SaveSettingsHandler>("SAVE_SETTINGS", (settings) => {
    saveSettingsAsync(settings);
    figma.notify("Settings saved!");
  });

  on<ClearSettingsHandler>("CLEAR_SETTINGS", () => {
    saveSettingsAsync({ user: figma.currentUser });
    figma.notify("Settings cleared!");
  });

  on<DownloadHandler>("DOWNLOAD", (image) => {
    Promise.all([
      figma.loadFontAsync({ family: "Inter", style: "Regular" }),
      figma.loadFontAsync({ family: "Inter", style: "Semi Bold" }),
      figma.loadFontAsync({ family: "Inter", style: "Bold" }),
    ]).then(() => {
      pasteImages({
        images: [image],
        hideVariant: true,
      });
      figma.notify("Image exported!");
    });
  });

  loadSettingsAsync({}).then((settings) => {
    emit<LoadSettingsHandler>("LOAD_SETTINGS", {
      ...settings,
      user: figma.currentUser,
    });
  });
}
