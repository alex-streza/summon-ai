import { EventHandler } from "@create-figma-plugin/utilities";

export type Settings = {
  token?: string;
  user?: User | null;
} & Record<string, unknown>;

type BaseUser = {
  id: string | null;
  name: string;
  photoUrl: string | null;
};

interface User extends BaseUser {
  color: string;
  sessionId: number;
}

export type Image = {
  url: string;
  prompt: string;
  name: string;
  photo_url: string;
};

export interface CloseHandler extends EventHandler {
  name: "CLOSE";
  handler: () => void;
}

export interface NotifyHandler extends EventHandler {
  name: "NOTIFY";
  handler: (message: string) => void;
}

export interface SaveSettingsHandler extends EventHandler {
  name: "SAVE_SETTINGS";
  handler: (settings: Settings) => void;
}

export interface ClearSettingsHandler extends EventHandler {
  name: "CLEAR_SETTINGS";
  handler: () => void;
}

export interface DownloadHandler extends EventHandler {
  name: "DOWNLOAD";
  handler: (image: Uint8Array) => void;
}

export interface SelectImageHandler extends EventHandler {
  name: "SELECT_IMAGE";
  handler: (image: string) => void;
}

export interface LoadSettingsHandler extends EventHandler {
  name: "LOAD_SETTINGS";
  handler: (settings: Settings) => void;
}
