import { EventHandler } from "@create-figma-plugin/utilities";

export type Settings = {
  token?: string;
  acceptSaveImage?: boolean;
  user?: User | null;
} & Record<string, unknown>;

export type WriteSettings {
  token?: string;
  acceptSaveImage?: boolean;
}

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
  avatar_url: string;
  created_at: string;
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
  handler: (settings: WriteSettings) => void;
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
