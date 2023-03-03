import {
  emit,
  loadSettingsAsync,
  showUI,
} from "@create-figma-plugin/utilities";
import registerCommonEvents from "../utils/registerCommonEvents";
import { LoadSettingsHandler } from "./../types/index";

export default function () {
  registerCommonEvents();

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
}
