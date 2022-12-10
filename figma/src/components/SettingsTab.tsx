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
import { WriteSettings } from "../types";
import { SlideOver } from "./Transitions";

type SettingsTabProps = {
  token?: string;
  acceptSaveImage?: boolean;
  onSaveSettings: (settings: WriteSettings) => void;
  onClearSettings: () => void;
};

export const SettingsTab = ({
  token: defaultToken,
  acceptSaveImage: defaultAcceptSaveImage,
  onSaveSettings,
  onClearSettings,
}: SettingsTabProps) => {
  const [token, setToken] = useState("");
  const [acceptSaveImage, setAcceptSaveImage] = useState(
    defaultAcceptSaveImage ?? false
  );

  useEffect(() => {
    setToken(defaultToken ?? "");
  }, [defaultToken]);

  const handleSaveSettings = useCallback(() => {
    onSaveSettings({ token, acceptSaveImage });
  }, [token, acceptSaveImage]);

  const handleToggleAcceptSaveImage = useCallback(() => {
    setAcceptSaveImage(!acceptSaveImage);
  }, [acceptSaveImage]);

  return (
    <SlideOver show>
      <Fragment>
        <VerticalSpace space="medium" />
        <h1 className="text-[28px] font-black leading-10">Settings</h1>
        <VerticalSpace space="medium" />
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
          <Button onClick={handleSaveSettings} disabled={!token} fullWidth>
            Save settings
          </Button>
          <Button onClick={onClearSettings} disabled={!token} fullWidth danger>
            Clear settings
          </Button>
        </Columns>
      </Fragment>
    </SlideOver>
  );
};
