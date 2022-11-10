import { EventHandler } from "@create-figma-plugin/utilities";

export interface ExportHandler extends EventHandler {
	name: "EXPORT";
	handler: (image: Uint8Array) => void;
}

export interface CloseHandler extends EventHandler {
	name: "CLOSE";
	handler: () => void;
}
