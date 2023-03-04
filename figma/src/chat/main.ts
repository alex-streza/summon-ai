import {
  emit,
  loadSettingsAsync,
  showUI,
} from "@create-figma-plugin/utilities";
import registerCommonEvents from "../utils/registerCommonEvents";
import { LoadSettingsHandler, Settings } from "./../types/index";

export default function () {
  registerCommonEvents();

  loadSettingsAsync({}).then((settings: Settings) => {
    emit<LoadSettingsHandler>("LOAD_SETTINGS", {
      ...settings,
      chats: settings.chats ?? {
        "Chat 1": [],
      },
      user: figma.currentUser,
    });
  });
  showUI({
    width: 740,
    height: 760,
  });
}
