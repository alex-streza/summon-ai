import {
  Button,
  Columns,
  Container,
  IconDraft32,
  IconPencil32,
  IconStar32,
  IconStarFilled32,
  Link,
  LoadingIndicator,
  Muted,
  RangeSlider,
  render,
  Tabs,
  Text,
  Textbox,
  TextboxMultiline,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { Fragment, h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

import { CloseHandler, ExportHandler } from "./types";

import "!../styles.css";
import { AboutTab } from "../components/AboutTab";
import { Editor } from "../components/Editor";
import { FadeIn, SlideOver } from "../components/Transitions";
import { OPENAI_API_KEY, RESOLUTIONS } from "../constants/config";
import {
  convertDataURIToBinary,
  uploadImages,
  urltoFile,
} from "../utils/image";
import { fadeInProps } from "../utils/transitions";
import { SettingsTab } from "../components/SettingsTab";

const RESOLUTION = RESOLUTIONS[1];

const GenerateTab = ({
  image,
  saveImage,
  settings,
}: {
  image: string;
  saveImage: (image: string) => void;
  settings: any;
}) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [reset, setReset] = useState(0);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [editedImage, setEditedImage] = useState<string | null>(null);
  const [viewOriginal, setViewOriginal] = useState(false);
  const [error, setError] = useState("");

  const size = parseInt(RESOLUTION.split("x")[0]);
  const [brushSize, setBrushSize] = useState(75);

  const handleEdit = useCallback(async () => {
    // DEVUGGING
    // const image = convertDataURIToBinary(
    // 	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
    // );

    // emit<ExportHandler>("EXPORT", image, prompt, token);
    // return;

    if (token != null && prompt && editedImage) {
      setLoading(true);
      const formData = new FormData();

      formData.append("image", await urltoFile(image, "image", "image/png"));
      formData.append(
        "mask",
        await urltoFile(editedImage, "mask", "image/png")
      );
      formData.append("size", RESOLUTIONS[2]);
      formData.append("prompt", prompt);
      formData.append("response_format", "b64_json");

      fetch("https://api.openai.com/v1/images/edits", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + (OPENAI_API_KEY ?? token),
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((res: { data: { b64_json: string }[] } | { error: any }) => {
          if ("data" in res) {
            const url = "data:image/png;base64," + res.data[0].b64_json;
            setGeneratedImage(url);

            uploadImages([
              {
                b64: url,
                filename:
                  prompt
                    .toLowerCase()
                    .replace(/[^a-zA-Z0-9 ]/g, "")
                    .replace(/ /g, "_") +
                  "-edit" +
                  ".png",
              },
            ]);
          } else {
            emit("NOTIFY", res.error.message);
            setError(res.error.message);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [token, prompt, editedImage]);

  const handleReset = useCallback(() => {
    setGeneratedImage(null);
    setReset(reset + 1);
  }, [reset]);

  const handleChangeSize = useCallback((ev: any) => {
    setBrushSize(ev.target.value);
  }, []);

  const handleCloseButtonClick = useCallback(() => {
    emit<CloseHandler>("CLOSE");
  }, []);

  const handleExport = useCallback(() => {
    if (generatedImage) {
      const image: Uint8Array = convertDataURIToBinary(generatedImage);

      emit<ExportHandler>("EXPORT", image, prompt, token);
    }
  }, [generatedImage, prompt, token]);

  useEffect(() => {
    if (settings.token) {
      setToken(settings.token);
    }
  }, [settings]);

  return (
    <Fragment>
      <VerticalSpace space="medium" />
      <h1 className="text-[28px] font-black leading-10">Edit image</h1>
      <VerticalSpace space="extraSmall" />
      <Text as={"p"}>
        Draw a mask where you want to edit. The prompt should describe the full
        new image, not just the erased area.
      </Text>
      <VerticalSpace space="extraLarge" />
      <div className="flex justify-between w-full">
        <Text as="span">Edit resolution: {RESOLUTION}</Text>
        <Text as="span">Output resolution: {RESOLUTIONS[2]}</Text>
      </div>
      <VerticalSpace space="small" />
      <div
        className="relative overflow-hidden border border-gray-500 rounded"
        style={{
          width: size,
          height: size,
        }}
      >
        <FadeIn show={!generatedImage}>
          <Editor
            image={image}
            reset={reset}
            size={size}
            loading={loading}
            brushSize={brushSize}
            onReset={handleReset}
            onImageChange={setEditedImage}
          />
        </FadeIn>
        <FadeIn {...fadeInProps} show={generatedImage != null}>
          <Fragment>
            <img
              src={viewOriginal ? image : (generatedImage as string)}
              width={size}
              height={size}
              style={{
                border: "none !important",
              }}
            />
            <div className="absolute flex gap-3 bottom-3 right-3">
              <button
                className="btn secondary"
                onClick={() => {
                  setViewOriginal(!viewOriginal);
                  setEditedImage(generatedImage);
                  saveImage(generatedImage as string);
                  setGeneratedImage(null);
                }}
              >
                <IconPencil32 />
                Continue editing
              </button>
              <button
                className="btn secondary"
                onClick={() => setViewOriginal(!viewOriginal)}
              >
                {viewOriginal ? <IconStar32 /> : <IconStarFilled32 />}
                {viewOriginal ? "View generated" : "View original"}
              </button>
              <button className="btn secondary" onClick={handleExport}>
                <IconDraft32 />
                Export
              </button>
            </div>
          </Fragment>
        </FadeIn>
      </div>
      <VerticalSpace space="large" />
      <Text>
        <Muted>Prompt</Muted>
      </Text>
      <VerticalSpace space="small" />
      <TextboxMultiline
        rows={2}
        placeholder="a photo of a happy corgi puppy sitting and facing forward, studio light, longshot"
        onValueInput={setPrompt}
        value={prompt}
        variant="border"
      />
      <VerticalSpace space="large" />
      <Text>
        <Muted>Brush size (25px-150px)</Muted>
      </Text>
      <VerticalSpace space="small" />
      <RangeSlider
        maximum={150}
        minimum={25}
        onInput={handleChangeSize}
        value={brushSize + ""}
      />
      <VerticalSpace space="large" />
      <Text>
        <Muted>Token</Muted>
      </Text>
      <VerticalSpace space="small" />
      <Textbox
        placeholder="Paste secret DALL-E-2 token"
        onValueInput={setToken}
        value={token}
        variant="border"
      />
      <VerticalSpace space="extraSmall" />
      <Link href="https://openai.com/api/pricing/" target="_blank">
        Get a DALL-E-2 token
      </Link>
      <VerticalSpace space="medium" />
      {error && (
        <Fragment>
          <span class="text-red-500">{error}</span>
          <VerticalSpace space="small" />
        </Fragment>
      )}
      {!generatedImage && (
        <Columns space="extraSmall">
          <Button
            fullWidth
            onClick={handleEdit}
            disabled={loading || !prompt || !token}
          >
            {loading && <LoadingIndicator color="brand" />}
            {!loading && "Edit image"}
          </Button>
          <Button fullWidth onClick={handleCloseButtonClick} secondary>
            Close
          </Button>
        </Columns>
      )}
      <VerticalSpace space="medium" />
    </Fragment>
  );
};

function Plugin(data: unknown) {
  const [value, setValue] = useState("Edit");
  const [image, setImage] = useState<string>("");
  const [settings, setSettings] = useState({});

  useEffect(() => {
    return on("SELECT_IMAGE", ({ image }: { image: string }) => {
      setImage("data:image/png;base64," + image);
    });
  }, []);

  useEffect(() => {
    return on("LOAD_SETTINGS", (settings) => {
      setSettings(settings);
    });
  }, []);

  return (
    <Container space="medium">
      <Tabs
        value={value}
        onValueChange={setValue}
        options={[
          {
            value: "Edit",
            children: (
              <SlideOver show>
                <GenerateTab
                  image={image}
                  saveImage={setImage}
                  settings={settings}
                />
              </SlideOver>
            ),
          },
          {
            value: "About",
            children: <AboutTab />,
          },
          {
            value: "Settings",
            children: <SettingsTab />,
          },
        ]}
      />
    </Container>
  );
}

export default render(Plugin);
