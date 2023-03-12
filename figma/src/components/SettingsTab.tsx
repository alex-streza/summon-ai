import {
  Button,
  Columns,
  Link,
  Muted,
  Text,
  Textbox,
  Toggle,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { Fragment, h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";
import { Settings, WriteSettings } from "../types";
import { apiClient } from "../utils/api";
import { SlideOver } from "./Transitions";

type SettingsTabProps = {
  openAIToken?: string;
  summonAIToken?: string;
  acceptSaveImage?: boolean;
  user?: Omit<Settings["user"], "sessionId" | "color">;
  onSaveSettings: (settings: WriteSettings) => void;
  onClearSettings: () => void;
};

export const SettingsTab = ({
  openAIToken: defaultOpenAIToken,
  summonAIToken: defaultSummonAIToken,
  acceptSaveImage: defaultAcceptSaveImage,
  user,
  onSaveSettings,
  onClearSettings,
}: SettingsTabProps) => {
  const [openAIToken, setOpenAIToken] = useState("");
  const [summonAIToken, setSummonAIToken] = useState("");
  const [acceptSaveImage, setAcceptSaveImage] = useState(false);

  useEffect(() => {
    setOpenAIToken(defaultOpenAIToken ?? "");
    setSummonAIToken(defaultSummonAIToken ?? "");
  }, [defaultOpenAIToken, defaultSummonAIToken]);

  useEffect(() => {
    setAcceptSaveImage(defaultAcceptSaveImage ?? false);
  }, [defaultAcceptSaveImage]);

  useEffect(() => {
    user && apiClient.session(user);
  }, [user]);

  const handleSaveSettings = useCallback(() => {
    onSaveSettings({
      openAIToken,
      summonAIToken,
      acceptSaveImage,
    });
  }, [openAIToken, summonAIToken, acceptSaveImage]);

  const handleToggleAcceptSaveImage = useCallback(() => {
    setAcceptSaveImage(!acceptSaveImage);
    onSaveSettings({
      openAIToken,
      summonAIToken,
      acceptSaveImage: !acceptSaveImage,
    });
  }, [openAIToken, summonAIToken, acceptSaveImage]);

  return (
    <SlideOver show>
      <Fragment>
        <VerticalSpace space="medium" />
        <h1 className="text-[28px] font-black leading-10">Settings</h1>
        <VerticalSpace space="medium" />
        <Text>
          <Muted>SummonAI Token</Muted>
        </Text>
        <VerticalSpace space="small" />
        <Textbox
          placeholder="Paste secret SummonAI token"
          onValueInput={setSummonAIToken}
          value={summonAIToken}
          variant="border"
        />
        <VerticalSpace space="extraSmall" />
        <Link href="https://summon-ai.com/auth/sign-in" target="_blank">
          Get a SummonAI token
        </Link>
        <VerticalSpace space="medium" />
        <Text>
          <Muted>OpenAI Token</Muted>
        </Text>
        <VerticalSpace space="small" />
        <Textbox
          placeholder="Paste secret DALL-E-2 token"
          onValueInput={setOpenAIToken}
          value={openAIToken}
          variant="border"
        />
        <VerticalSpace space="extraSmall" />
        <Link href="https://openai.com/api/pricing/" target="_blank">
          Get an OpenAI DALL-E-2 token
        </Link>
        <VerticalSpace space="medium" />
        <Text>
          <Muted>Permissions</Muted>
        </Text>
        <VerticalSpace space="small" />
        <Toggle
          value={acceptSaveImage}
          onClick={handleToggleAcceptSaveImage}
          size={48}
        >
          <Text size={14}>
            <Muted>Save images to storage & showcase in discover</Muted>
          </Text>
        </Toggle>
        <VerticalSpace space="small" />
        <Text>
          <Muted>
            {acceptSaveImage
              ? "Generated images will be saved in cloud storage and be publicly accessible in the discover tab as well personal history."
              : "No images will be saved and history will not be accessible."}
          </Muted>
        </Text>
        <VerticalSpace space="large" />
        <Columns space="extraSmall">
          <Button
            onClick={handleSaveSettings}
            disabled={!openAIToken && !summonAIToken}
            fullWidth
          >
            Save settings
          </Button>
          <Button
            onClick={onClearSettings}
            disabled={!openAIToken && !summonAIToken}
            fullWidth
            danger
          >
            Clear settings
          </Button>
        </Columns>
      </Fragment>
    </SlideOver>
  );
};
