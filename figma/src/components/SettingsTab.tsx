import {
  Button,
  Columns,
  Link,
  Muted,
  Text,
  Textbox,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { Fragment, h } from "preact";
import { useCallback } from "preact/hooks";
import { useEffect, useState } from "preact/hooks";
import { SlideOver } from "./Transitions";

type SettingsTabProps = {
  token?: string;
  onSaveSettings: (settings: { token: string }) => void;
  onClearSettings: () => void;
};

export const SettingsTab = ({
  token: defaultToken,
  onSaveSettings,
  onClearSettings,
}: SettingsTabProps) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    setToken(defaultToken ?? "");
  }, [defaultToken]);

  const handleSaveSettings = useCallback(() => {
    onSaveSettings({ token });
  }, [token]);

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
        <Columns space="extraSmall">
          <Button onClick={handleSaveSettings} disabled={!token} fullWidth>
            {/* {loading && <LoadingIndicator color="brand" />} */}
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
