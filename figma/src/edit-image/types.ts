import { EventHandler } from "@create-figma-plugin/utilities";

export interface ExportHandler extends EventHandler {
  name: "EXPORT";
  handler: (image: Uint8Array, prompt: string, token: string) => void;
}
