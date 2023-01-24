import {
  Button,
  Checkbox,
  Columns,
  Container,
  Dropdown,
  FileUploadDropzone,
  IconTrash32,
  LoadingIndicator,
  Muted,
  render,
  Tabs,
  Text,
  TextboxMultiline,
  TextboxNumeric,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { Fragment, h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

import "!../styles.css";
import { AboutTab } from "../components/AboutTab";
import { DiscoverTab } from "../components/DiscoverTab";
import { SettingsTab } from "../components/SettingsTab";
import { SlideOver } from "../components/Transitions";
import {
  MIDJOURNEY_HEIGHTS,
  MIDJOURNEY_WIDTHS,
  RESTORE_VERSIONS,
} from "../constants/config";
import {
  ClearSettingsHandler,
  CloseHandler,
  NotifyHandler,
  SaveSettingsHandler,
  SelectImageHandler,
  Settings,
  WriteSettings,
} from "../types";
import { apiClient } from "../utils/api";
import {
  convertDataURIToBinary,
  fileToBase64,
  urlToBase64,
} from "../utils/image";
import { GenerateHandler } from "./types";

const GenerateTab = ({ settings }: { settings: Settings }) => {
  const [count, setCount] = useState<number | null>(1);
  const [width, setWidth] = useState(MIDJOURNEY_WIDTHS[2]);
  const [height, setHeight] = useState(MIDJOURNEY_HEIGHTS[2]);
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [error, setError] = useState("");

  const handleGenerateButtonClick = useCallback(async () => {
    if (count !== null && prompt != null) {
      setLoading(true);

      const { color, sessionId, ...user } = settings.user as User;

      try {
        const { predictions } = await apiClient.generateOpenjourney({
          prompt,
          width,
          height,
          num_outputs: count,
        });

        const images: {
          b64: string;
          uintArray: Uint8Array;
          url: string;
          filename: string;
        }[] = [];

        for (let i = 0; i < predictions.length; i++) {
          const base64 = await urlToBase64(predictions[i]);

          images.push({
            b64: base64,
            url: predictions[i],
            uintArray: convertDataURIToBinary(base64),
            filename: prompt + " " + i,
          });
        }

        emit<GenerateHandler>(
          "GENERATE",
          prompt,
          width + "x" + height,
          images.map(({ uintArray }) => uintArray)
        );

        if (settings.acceptSaveImage) {
          apiClient.uploadImages(
            images.map(({ uintArray, ...rest }) => ({ ...rest })),
            user,
            "openjourney-generation",
            prompt
          );
        }
      } catch (error: any) {
        emit<NotifyHandler>("NOTIFY", error.message);
        setError(error?.message);
      }
      setLoading(false);
    }
  }, [count, prompt, width, height, settings.user, settings.acceptSaveImage]);

  const handleCloseButtonClick = useCallback(function () {
    emit<CloseHandler>("CLOSE");
  }, []);

  return (
    <SlideOver show>
      <Fragment>
        <VerticalSpace space="medium" />
        <h1 className="text-[28px] font-black leading-10">
          Generate Midjourney-like images
        </h1>
        <VerticalSpace space="extraSmall" />
        <Text as={"p"}>
          Time to summon some beautiful images with OpenJourney AI
        </Text>
        <VerticalSpace space="extraLarge" />
        <Text>
          <Muted>Prompt</Muted>
        </Text>
        <VerticalSpace space="small" />
        <TextboxMultiline
          placeholder="mdjrny-v4 style portrait of female elf, intricate, elegant, highly detailed, digital painting, artstation, concept art, smooth, sharp focus, illustration, art by artgerm and greg rutkowski and alphonse mucha, 8k"
          onValueInput={setPrompt}
          variant="border"
          value={prompt}
          rows={3}
        />
        <VerticalSpace space="large" />
        <Columns space="medium">
          <div>
            <Text>
              <Muted>Count</Muted>
            </Text>
            <VerticalSpace space="small" />
            <Dropdown
              options={[1, 4].map((count) => ({
                text: count + "",
                value: count,
              }))}
              onValueChange={setCount}
              value={count}
              variant="border"
            />
          </div>
          <div>
            <Text>
              <Muted>Width</Muted>
            </Text>
            <VerticalSpace space="small" />
            <Dropdown
              options={MIDJOURNEY_WIDTHS.map((w) => ({
                text: w + "",
                value: w,
              }))}
              onValueChange={setWidth}
              value={width}
              variant="border"
            />
          </div>
          <div>
            <Text>
              <Muted>Height</Muted>
            </Text>
            <VerticalSpace space="small" />
            <Dropdown
              options={MIDJOURNEY_HEIGHTS.map((h) => ({
                text: h + "",
                value: h,
              }))}
              onValueChange={setHeight}
              value={height}
              variant="border"
            />
          </div>
        </Columns>
        <VerticalSpace space="medium" />
        {error && (
          <Fragment>
            <span className="text-red-500">{error}</span>
            <VerticalSpace space="small" />
          </Fragment>
        )}
        <Columns space="extraSmall">
          <Button
            fullWidth
            onClick={handleGenerateButtonClick}
            disabled={loading || !prompt || !count}
          >
            {loading && <LoadingIndicator color="disabled" />}
            {!loading &&
              "Generate " + (count && count > 1 ? `${count} images` : "image")}
          </Button>
          <Button fullWidth onClick={handleCloseButtonClick} secondary>
            Close
          </Button>
        </Columns>
      </Fragment>
    </SlideOver>
  );
};

const acceptedFileTypes = ["image/png", "image/jpeg"];

const RestoreTab = ({
  image,
  setImage,
  settings,
}: {
  settings: Settings;
  image: string;
  setImage: (image: string) => void;
}) => {
  const [version, setVersion] = useState(RESTORE_VERSIONS[2]);
  const [scale, setScale] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRestoreButtonClick = useCallback(async () => {
    setLoading(true);

    const { color, sessionId, ...user } = settings.user as User;

    try {
      const { prediction } = await apiClient.restoreImage({
        img: image,
        version,
        scale,
      });

      const images: {
        b64: string;
        uintArray: Uint8Array;
        filename: string;
        url: string;
      }[] = [];

      const base64 = await urlToBase64(prediction);

      images.push({
        b64: base64,
        url: prediction,
        uintArray: convertDataURIToBinary(base64),
        filename: "restored",
      });

      emit<GenerateHandler>(
        "GENERATE",
        "Restored",
        "512x512",
        images.map(({ uintArray }) => uintArray)
      );

      if (settings.acceptSaveImage) {
        apiClient.uploadImages(
          images.map(({ uintArray, ...rest }) => ({ ...rest })),
          user,
          "restored"
        );
      }
    } catch (error: any) {
      emit<NotifyHandler>("NOTIFY", error.message);
      setError(error?.message);
    }
    setLoading(false);
  }, [settings.user, image, version, scale, settings.acceptSaveImage]);

  const handleCloseButtonClick = useCallback(function () {
    emit<CloseHandler>("CLOSE");
  }, []);

  const handleChangeScale = useCallback(
    (event: h.JSX.TargetedEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.value;
      setScale(parseInt(newValue));
    },
    []
  );

  const handleSelectedFiles = useCallback(
    async (files: File[]) => {
      const base64 = await fileToBase64(files[0]);
      setImage(base64);
    },
    [setImage]
  );

  const handleRemoveImage = useCallback(() => setImage(""), [setImage]);

  return (
    <SlideOver show>
      <Fragment>
        <VerticalSpace space="medium" />
        <h1 className="text-[28px] font-black leading-10">Restore images</h1>
        <VerticalSpace space="extraSmall" />
        <Text as={"p"}>
          Restore *old photos* or *AI-generated faces* with AI
        </Text>
        <VerticalSpace space="extraLarge" />
        {!image && (
          <FileUploadDropzone
            acceptedFileTypes={acceptedFileTypes}
            onSelectedFiles={handleSelectedFiles}
          >
            <Text align="center">
              <Muted>Select an image in the viewport or upload your own.</Muted>
            </Text>
          </FileUploadDropzone>
        )}
        {image && (
          <div className="relative w-fit">
            <img
              src={image}
              alt="image"
              height={256}
              class="w-auto rounded-md"
            />
            <div className="absolute" style={{ top: 8, right: 8 }}>
              <Button onClick={handleRemoveImage} danger>
                <IconTrash32 />
              </Button>
            </div>
          </div>
        )}
        <VerticalSpace space="medium" />
        <Columns space="medium">
          <div>
            <Text>
              <Muted>Version</Muted>
            </Text>
            <VerticalSpace space="small" />
            <Dropdown
              options={RESTORE_VERSIONS.map((v) => ({
                text: v,
                value: v,
              }))}
              onValueChange={setVersion}
              value={version}
              variant="border"
            />
          </div>
          <div>
            <Text>
              <Muted>Scale</Muted>
            </Text>
            <VerticalSpace space="small" />
            <TextboxNumeric
              onInput={handleChangeScale}
              variant="border"
              value={scale + ""}
              max={10}
              min={1}
            />
          </div>
        </Columns>
        <VerticalSpace space="medium" />
        {error && (
          <Fragment>
            <span className="text-red-500">{error}</span>
            <VerticalSpace space="small" />
          </Fragment>
        )}
        <Columns space="extraSmall">
          <Button
            fullWidth
            onClick={handleRestoreButtonClick}
            disabled={loading || !prompt}
          >
            {loading && <LoadingIndicator color="disabled" />}
            {!loading && "Restore"}
          </Button>
          <Button fullWidth onClick={handleCloseButtonClick} secondary>
            Close
          </Button>
        </Columns>
      </Fragment>
    </SlideOver>
  );
};

const UpscaleTab = ({
  image,
  setImage,
  settings,
}: {
  settings: Settings;
  image: string;
  setImage: (image: string) => void;
}) => {
  const [scale, setScale] = useState(8);
  const [faceEnhance, setFaceEnhance] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRestoreButtonClick = useCallback(async () => {
    setLoading(true);

    const { color, sessionId, ...user } = settings.user as User;

    try {
      const { prediction } = await apiClient.upscaleImage({
        image,
        face_enhance: faceEnhance,
        scale,
      });

      const images: {
        b64: string;
        uintArray: Uint8Array;
        filename: string;
        url: string;
      }[] = [];

      const base64 = await urlToBase64(prediction);

      images.push({
        b64: base64,
        url: prediction,
        uintArray: convertDataURIToBinary(base64),
        filename: "upscaled",
      });

      emit<GenerateHandler>(
        "GENERATE",
        "Upscaled",
        "512x512",
        images.map(({ uintArray }) => uintArray)
      );

      if (settings.acceptSaveImage) {
        apiClient.uploadImages(
          images.map(({ uintArray, ...rest }) => ({ ...rest })),
          user,
          "upscaled"
        );
      }
    } catch (error: any) {
      emit<NotifyHandler>("NOTIFY", error.message);
      setError(error?.message);
    }
    setLoading(false);
  }, [settings.user, image, faceEnhance, scale, settings.acceptSaveImage]);

  const handleCloseButtonClick = useCallback(function () {
    emit<CloseHandler>("CLOSE");
  }, []);

  const handleChangeScale = useCallback(
    (event: h.JSX.TargetedEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.value;
      setScale(parseInt(newValue));
    },
    []
  );

  const handleChangeFaceEnhance = useCallback(
    (event: h.JSX.TargetedEvent<HTMLInputElement>) => {
      const newValue = event.currentTarget.value;
      setFaceEnhance(Boolean(newValue));
    },
    []
  );

  const handleSelectedFiles = useCallback(
    async (files: File[]) => {
      const base64 = await fileToBase64(files[0]);
      setImage(base64);
    },
    [setImage]
  );

  const handleRemoveImage = useCallback(() => setImage(""), [setImage]);

  return (
    <SlideOver show>
      <Fragment>
        <VerticalSpace space="medium" />
        <h1 className="text-[28px] font-black leading-10">Upscale images</h1>
        <VerticalSpace space="extraSmall" />
        <Text as={"p"}>
          Upscale images (and optional face correction) with AI
        </Text>
        <VerticalSpace space="extraLarge" />
        {!image && (
          <FileUploadDropzone
            acceptedFileTypes={acceptedFileTypes}
            onSelectedFiles={handleSelectedFiles}
          >
            <Text align="center">
              <Muted>Select an image in the viewport or upload your own.</Muted>
            </Text>
          </FileUploadDropzone>
        )}
        {image && (
          <div className="relative w-fit">
            <img
              src={image}
              alt="image"
              height={256}
              class="w-auto rounded-md"
            />
            <div className="absolute" style={{ top: 8, right: 8 }}>
              <Button onClick={handleRemoveImage} danger>
                <IconTrash32 />
              </Button>
            </div>
          </div>
        )}
        <VerticalSpace space="medium" />
        <Columns
          space="medium"
          className="flex items-center"
          style={{ gap: 20 }}
        >
          <div>
            <Text>
              <Muted>Scale</Muted>
            </Text>
            <VerticalSpace space="small" />
            <TextboxNumeric
              onInput={handleChangeScale}
              variant="border"
              value={scale + ""}
              max={10}
              min={1}
            />
          </div>
          <div>
            <VerticalSpace space="small" />
            <Checkbox
              onInput={handleChangeFaceEnhance}
              checked={faceEnhance}
              value={faceEnhance}
            >
              <Text>
                <Muted>Face enhance</Muted>
              </Text>
            </Checkbox>
          </div>
        </Columns>
        <VerticalSpace space="medium" />
        {error && (
          <Fragment>
            <span className="text-red-500">{error}</span>
            <VerticalSpace space="small" />
          </Fragment>
        )}
        <Columns space="extraSmall">
          <Button
            fullWidth
            onClick={handleRestoreButtonClick}
            disabled={loading || !prompt}
          >
            {loading && <LoadingIndicator color="disabled" />}
            {!loading && "Upscale"}
          </Button>
          <Button fullWidth onClick={handleCloseButtonClick} secondary>
            Close
          </Button>
        </Columns>
      </Fragment>
    </SlideOver>
  );
};

function Plugin() {
  const [value, setValue] = useState("🖼️ Generate");
  const [settings, setSettings] = useState<Settings>({});
  const [image, setImage] = useState("");

  useEffect(() => {
    return on<SelectImageHandler>("SELECT_IMAGE", (image) => {
      setImage("data:image/png;base64," + image);
    });
  }, []);

  useEffect(() => {
    return on("LOAD_SETTINGS", (newSettings) => {
      setSettings({
        ...settings,
        ...newSettings,
      });
    });
  }, [settings]);

  const handleSaveSettings = useCallback(
    ({ token, acceptSaveImage }: WriteSettings) => {
      emit<SaveSettingsHandler>("SAVE_SETTINGS", { token, acceptSaveImage });
      setSettings({ ...settings, token, acceptSaveImage });
    },
    [settings]
  );

  const handleClearSettings = useCallback(() => {
    emit<ClearSettingsHandler>("CLEAR_SETTINGS");
    setSettings({ ...settings, token: undefined });
  }, [settings]);

  return (
    <Container space="medium">
      <Tabs
        value={value}
        onValueChange={setValue}
        options={[
          {
            value: "🖼️ Generate",
            children: <GenerateTab settings={settings} />,
          },
          {
            value: "📷 Restore",
            children: (
              <RestoreTab
                image={image}
                settings={settings}
                setImage={setImage}
              />
            ),
          },
          {
            value: "🆙 Upscale",
            children: (
              <UpscaleTab
                image={image}
                settings={settings}
                setImage={setImage}
              />
            ),
          },
          {
            value: "Discover",
            children: <DiscoverTab userId={settings.user?.id} />,
          },
          {
            value: "Settings",
            children: (
              <SettingsTab
                token={settings.token}
                acceptSaveImage={settings.acceptSaveImage}
                onSaveSettings={handleSaveSettings}
                onClearSettings={handleClearSettings}
              />
            ),
          },
          {
            value: "About",
            children: <AboutTab />,
          },
        ]}
      />
    </Container>
  );
}

export default render(Plugin);
