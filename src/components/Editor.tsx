import {
  IconArrowLeftCircle32,
  IconReturn32,
  IconSwap32,
  LoadingIndicator,
} from "@create-figma-plugin/ui";
import Konva from "konva";
import { Layer } from "konva/lib/Layer";
import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import { Fragment, h } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

interface EditorProps {
  image: string;
  reset: number;
  size: number;
  brushSize: number;
  loading: boolean;
  onImageChange: (image: string) => void;
  onReset: () => void;
}

export const Editor = ({
  image,
  reset,
  size,
  brushSize,
  onReset,
  loading,
  onImageChange,
}: EditorProps) => {
  const stageRef = useRef<Stage>();
  const canvasLayerRef = useRef<Layer>();

  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [imageLoading, setImageLoading] = useState(true);
  const [showCursor, setShowCursor] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({
    x: 0,
    y: 0,
  });

  const saveToHistory = useCallback((image: string) => {
    setHistoryIndex((historyIndex) => {
      setHistory((history) => {
        let newHistory = [...history];

        if (newHistory.length > 5) {
          newHistory.shift();
        }

        return [...newHistory, image];
      });
      return historyIndex < 5 ? historyIndex + 1 : 5;
    });
  }, []);

  const reLoadCanvasLayer = useCallback(
    (image: string) => {
      stageRef.current = new Konva.Stage({
        container: "image-editor",
        width: size,
        height: size,
      });

      canvasLayerRef.current = new Konva.Layer();
      stageRef.current.add(canvasLayerRef.current);

      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;

      const canvasImage = new Konva.Image({
        image: canvas,
        x: 0,
        y: 0,
      });
      canvasLayerRef.current.add(canvasImage);

      const context = canvas.getContext("2d");

      if (context) {
        const imageObj = new Image();
        imageObj.src = image;
        imageObj.onload = function () {
          context.drawImage(imageObj, 0, 0, size, size);
          canvasImage.image(canvas);
          canvasLayerRef.current && canvasLayerRef.current.draw();

          setImageLoading(false);
        };

        context.strokeStyle = "#000000";
        context.lineJoin = "round";
        context.lineWidth = brushSize;
      }

      let isPaint = false;
      let lastPointerPosition: Vector2d | null = null;

      if (context) {
        stageRef.current.on("mousedown touchstart", function () {
          isPaint = true;
          if (stageRef.current) {
            lastPointerPosition = stageRef.current.getPointerPosition();
            const image = stageRef.current.toDataURL({
              pixelRatio: 2,
            });
            saveToHistory(image);
          }
        });

        stageRef.current.on("mouseup touchend", function () {
          isPaint = false;
          if (stageRef.current) {
            onImageChange(
              stageRef.current.toDataURL({
                pixelRatio: 2,
              })
            );
          }
        });

        stageRef.current.on("mousemove touchmove", function () {
          if (!isPaint) return;

          context.globalCompositeOperation = "destination-out";
          context.beginPath();

          if (lastPointerPosition && stageRef.current) {
            let localPos = {
              x: lastPointerPosition.x - canvasImage.x(),
              y: lastPointerPosition.y - canvasImage.y(),
            };
            context.moveTo(localPos.x, localPos.y);
            const pos = stageRef.current.getPointerPosition();
            if (pos) {
              localPos = {
                x: pos.x - canvasImage.x(),
                y: pos.y - canvasImage.y(),
              };
              context.lineTo(localPos.x, localPos.y);
              context.closePath();
              context.stroke();

              lastPointerPosition = pos;
              canvasLayerRef.current && canvasLayerRef.current.batchDraw();
            }
          }
        });
      }
    },
    [reset, brushSize]
  );

  const handleUndo = useCallback(() => {
    stageRef.current?.destroy();

    reLoadCanvasLayer(history[historyIndex]);
    setHistoryIndex(historyIndex - 1);
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    stageRef.current?.destroy();

    const newIndex = historyIndex + 1;
    reLoadCanvasLayer(history[newIndex]);
    setHistoryIndex(newIndex);
  }, [history, historyIndex]);

  const handleMouseMove = useCallback((event: MouseEvent) => {
    setCursorPosition({
      x: event.offsetX,
      y: event.offsetY,
    });
    setShowCursor(true);
  }, []);

  useEffect(() => {
    setHistory([]);
    setHistoryIndex(-1);
  }, [reset]);

  useEffect(() => {
    reLoadCanvasLayer(image);
  }, [image, reset, brushSize]);

  return (
    <Fragment>
      {imageLoading && (
        <div className="loading-indicator">
          <LoadingIndicator />
        </div>
      )}
      <img
        src="https://imagedelivery.net/_X5WqasCPTrKkrSW6EvwJg/9765cfbc-c4dd-4ff1-eddf-c4fb64fd2300/public"
        alt="transparent mask"
        className="absolute top-0 left-0"
        width={512}
        height={512}
      />
      <div
        id="image-editor"
        className="cursor-pointer"
        onMouseLeave={() => setShowCursor(false)}
        onMouseMove={handleMouseMove}
      >
        {showCursor && (
          <div
            className="cursor-follow"
            style={{
              width: brushSize,
              height: brushSize,
              top: cursorPosition.y,
              left: cursorPosition.x,
            }}
          />
        )}
      </div>
      {history.length > 0 && !loading && (
        <div className="absolute top-3 right-3 flex gap-3">
          <button
            className="btn secondary icon-only"
            disabled={historyIndex === -1}
            onClick={handleUndo}
          >
            <IconReturn32 />
          </button>
          {/* <button
            className="btn secondary"
            disabled={historyIndex == history.length - 1}
            onClick={handleRedo}
          >
            <IconArrowRightCircle32 />
          </button> */}
          <button className="btn secondary icon-only" onClick={onReset}>
            <IconSwap32 />
          </button>
        </div>
      )}
    </Fragment>
  );
};
