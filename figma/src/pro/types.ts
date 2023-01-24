import { EventHandler } from "@create-figma-plugin/utilities";

export interface GenerateHandler extends EventHandler {
  name: "GENERATE";
  handler: (prompt: string, resolution: string, images: Uint8Array[]) => void;
}
