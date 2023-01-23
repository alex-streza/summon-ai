import {
  Button,
  Columns,
  Container,
  Dropdown,
  LoadingIndicator,
  Muted,
  render,
  Tabs,
  Text,
  TextboxMultiline,
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
import { MIDJOURNEY_HEIGHTS, MIDJOURNEY_WIDTHS } from "../constants/config";
import {
  ClearSettingsHandler,
  CloseHandler,
  NotifyHandler,
  SaveSettingsHandler,
  Settings,
  WriteSettings,
} from "../types";
import { apiClient } from "../utils/api";
import { convertDataURIToBinary, urlToBase64 } from "../utils/image";
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
          filename: string;
        }[] = [];

        for (let i = 0; i < predictions.length; i++) {
          const base64 = await urlToBase64(predictions[i]);

          images.push({
            b64: base64,
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
  );
};

function Plugin() {
  const [value, setValue] = useState("Generate");
  const [settings, setSettings] = useState<Settings>({});

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
            value: "Generate",
            children: (
              <SlideOver show>
                <GenerateTab settings={settings} />
              </SlideOver>
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
