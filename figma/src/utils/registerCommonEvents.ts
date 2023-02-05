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
  ExportHandler,
  LoadSettingsHandler,
  NotifyHandler,
  SaveSettingsHandler,
  Settings,
} from "../types";
import { pasteImages } from "../utils/pasteImages";

export default function () {
  once<CloseHandler>("CLOSE", function () {
    figma.closePlugin();
  });

  on<NotifyHandler>("NOTIFY", figma.notify);

  on<SaveSettingsHandler>("SAVE_SETTINGS", (settings) => {
    saveSettingsAsync(settings);

    emit<LoadSettingsHandler>("LOAD_SETTINGS", {
      ...settings,
      user: figma.currentUser,
    });
    figma.notify("Settings saved!");
  });

  on<ClearSettingsHandler>("CLEAR_SETTINGS", () => {
    saveSettingsAsync({ user: figma.currentUser, acceptSaveImage: false });

    emit<LoadSettingsHandler>("LOAD_SETTINGS", {
      user: figma.currentUser,
      acceptSaveImage: false,
      openAIToken: undefined,
      summonAIToken: undefined,
    });

    figma.notify("Settings cleared!");
  });

  on<ExportHandler>("EXPORT", (image) => {
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

  loadSettingsAsync<Settings>({}).then((settings) => {
    emit<LoadSettingsHandler>("LOAD_SETTINGS", {
      acceptSaveImage: true,
      ...settings,
      user: figma.currentUser,
    });
  });
}
