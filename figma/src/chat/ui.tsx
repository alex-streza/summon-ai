import {
  Button,
  Container,
  LoadingIndicator,
  Muted,
  render,
  Tabs,
  Text,
  TextboxMultiline,
  VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import { createRef, h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

import "!../styles.css";

import { AboutTab } from "../components/AboutTab";
import { DiscoverTab } from "../components/DiscoverTab";
import { SettingsTab } from "../components/SettingsTab";
import { SlideOver } from "../components/Transitions";
import {
  ClearSettingsHandler,
  CloseHandler,
  SaveSettingsHandler,
  Settings,
  WriteSettings,
} from "../types";
import spacetime from "spacetime";
import { ChatResponse } from "./types";

type Roles = "assistant" | "user" | "system";

interface MessageProps {
  date: Date;
  text: string;
  role?: Roles;
  left?: boolean;
}

const Message = ({ text, date, role, left }: MessageProps) => {
  return (
    <div className="">
      <div className={`chat${left ? " left" : ""}`}>
        <div className="flex justify-between gap-5">
          <span className="font-bold">
            {left ? "ChatGPT" : "You"} ({role})
          </span>
          <span>at {spacetime(date).format("nice")}</span>
        </div>
        <p className="m-0 mt-2 text-base">{text}</p>
      </div>
    </div>
  );
};

const ChatTab = ({ settings }: { settings: any }) => {
  const [token, setToken] = useState("");
  const [tokenExists, setTokenExists] = useState(true);

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<MessageProps[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (settings.openAIToken) {
      setToken(settings.openAIToken);
    }
    setTokenExists(!!settings.openAIToken);
  }, [settings]);

  const handleSendMessage = useCallback(async () => {
    if (token != null && message) {
      setMessage("");

      const role = (
        messages.length == 0
          ? "system"
          : messages.length == 1
          ? "assistant"
          : "user"
      ) as Roles;
      const newMessages = [
        ...messages,
        {
          text: message,
          date: new Date(),
          role,
        },
      ];

      setMessages(newMessages);

      setLoading(true);
      const data = {
        model: "gpt-3.5-turbo",
        messages: newMessages.map((m) => ({
          content: m.text,
          role: m.role,
        })),
      };

      fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((res: ChatResponse | { error: any }) => {
          if ("error" in res) {
            setError(res.error);
            return;
          }

          setMessages([
            ...newMessages,
            {
              date: new Date(),
              text: res.choices[0].message.content,
              role: res.choices[0].message.role as Roles,
            },
          ]);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [token, message]);

  const handleCloseButtonClick = useCallback(() => {
    emit<CloseHandler>("CLOSE");
  }, []);

  return (
    <div>
      <VerticalSpace space="medium" />
      <h1 className="text-[28px] font-black leading-10">Chat</h1>
      <VerticalSpace space="extraSmall" />
      <Text as={"p"}>
        It's finaly here! ChatGPT directly in Figma, no need to open other
        browser tabs anymore.
      </Text>
      <VerticalSpace space="extraLarge" />
      <div className="chat-container">
        <Message
          text="Hi, Sammy here! Tell me what am I? for example: 'You are a helpful UX/UI design assistant'"
          date={new Date()}
          role="system"
          left
        />
        {messages.map((m, i) => (
          <Message {...m} left={i % 2 != 0} />
        ))}
      </div>
      <div className="fixed bottom-0 left-0 flex w-full items-end gap-3 bg-gray-400 p-3">
        <div className="w-full flex-1">
          <Text>
            <Muted>Prompt</Muted>
          </Text>
          <VerticalSpace space="small" />
          <TextboxMultiline
            rows={1}
            placeholder="anything you want to ask"
            onValueInput={setMessage}
            value={message}
            variant="border"
          />
        </div>
        <Button
          fullWidth
          onClick={handleSendMessage}
          disabled={loading || !message || !token}
        >
          {loading && <LoadingIndicator color="disabled" />}
          {!loading && "Send"}
        </Button>
      </div>
    </div>
  );
};

function Plugin(data: unknown) {
  const [value, setValue] = useState("Chat");
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
    (newSettings: WriteSettings) => {
      emit<SaveSettingsHandler>("SAVE_SETTINGS", newSettings);
      setSettings({
        ...settings,
        ...newSettings,
      });
    },
    [settings]
  );

  const handleClearSettings = useCallback(() => {
    emit<ClearSettingsHandler>("CLEAR_SETTINGS");
    setSettings({ ...settings, openAIToken: undefined });
  }, [settings]);

  return (
    <Container space="medium">
      <Tabs
        value={value}
        onValueChange={setValue}
        options={[
          {
            value: "Chat",
            children: (
              <SlideOver show>
                <ChatTab settings={settings} />
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
                {...settings}
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
