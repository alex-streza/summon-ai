import { EventHandler } from "@create-figma-plugin/utilities";

export interface GenerateHandler extends EventHandler {
  name: "GENERATE";
  handler: (resolution: string, images: Uint8Array[], token: string) => void;
}

export interface CloseHandler extends EventHandler {
  name: "CLOSE";
  handler: () => void;
}
