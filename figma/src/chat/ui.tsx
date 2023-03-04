import {
  Banner,
  Button,
  Container,
  IconInfo32,
  Link,
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
import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "preact/hooks";

import "!../styles.css";

import { CheckIcon, CopyIcon } from "@primer/octicons-react";
import copy from "copy-to-clipboard";
import ReactMarkdown from "react-markdown";
import spacetime from "spacetime";
import { AboutTab } from "../components/AboutTab";
import { DiscoverTab } from "../components/DiscoverTab";
import { SettingsTab } from "../components/SettingsTab";
import { SlideOver } from "../components/Transitions";
import {
  ClearSettingsHandler,
  MessageProps,
  NotifyHandler,
  Roles,
  SaveSettingsHandler,
  Settings,
  WriteSettings,
} from "../types";
import { ChatResponse } from "./types";

// TODO: Prepare social media post
// TODO: Allow change tab name

const Message = ({
  children,
  date,
  role,
  left,
  text = "",
  hideCopy,
}: MessageProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    copy(text);
    setCopied(true);

    emit<NotifyHandler>("NOTIFY", "Message copied to clipboard.");

    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <div className={`chat${left ? " left" : ""}`}>
      <div className="flex justify-between gap-5">
        <span className="font-bold">
          {left ? "🤖 CHAPI" : "You"} ({role}){" "}
          <span>at {spacetime(date).format("nice")}</span>
        </span>
        {!hideCopy && (
          <button
            className={`ml-auto flex cursor-pointer ${
              copied ? "text-green-500" : ""
            }`}
            onClick={handleCopy}
          >
            {!copied ? <CopyIcon /> : <CheckIcon />}
          </button>
        )}
      </div>
      {children ? (
        <div className="m-0 mt-2 whitespace-pre-wrap text-base">{children}</div>
      ) : (
        <div className="markdown-message">
          <ReactMarkdown>{text}</ReactMarkdown>
        </div>
      )}
    </div>
  );
};

const USD = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 4,
  minimumFractionDigits: 4,
});

interface ChatProps {
  messages: MessageProps[];
  token: string;
  handleNewChat: () => void;
  updateChats: (messages: MessageProps[]) => void;
  deleteChat: () => void;
}

const Chat = ({
  messages,
  token,
  handleNewChat,
  updateChats,
  deleteChat,
}: ChatProps) => {
  const chatRef = useRef<HTMLDivElement>(null);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

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
      updateChats(newMessages);

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
            setError(res.error.message);
            return;
          }

          updateChats([
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

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (messages.length == 0)
      setMessage("You are a helpful UI/UX design assistant");
  }, [messages]);

  return (
    <div className="relative mt-5">
      <div className="absolute top-0 right-0 -mt-16 flex gap-3">
        {messages.length > 0 && (
          <Button onClick={deleteChat} disabled={loading || !token} danger>
            {loading && <LoadingIndicator color="disabled" />}
            {!loading && "Clear chat"}
          </Button>
        )}
        <Button onClick={handleNewChat} disabled={loading || !token}>
          {loading && <LoadingIndicator color="disabled" />}
          {!loading && "New chat"}
        </Button>
      </div>
      <div ref={chatRef} className="chat-container">
        <Message date={new Date()} role="system" left hideCopy>
          <Fragment>
            Hi, <span className="font-bold text-green-500">CHAPI</span> here!
            I'm here to <span className="font-semibold">help you</span> with
            your design process but I can do a variety of other things as well.
            <br />
            <br />
            Let's start with what you want me to be, for example:
            <span className="italic text-gray-100">
              'You are a helpful UI/UX design assistant'
            </span>
          </Fragment>
        </Message>
        {messages.map((m, i) => (
          <Message {...m} left={i % 2 != 0} text={m.text} />
        ))}
      </div>
      <div className="fixed bottom-0 left-0 flex w-full items-end gap-3 bg-gray-400 p-3">
        <div className="w-full flex-1">
          <Text>
            <Muted>Message</Muted>
          </Text>
          <VerticalSpace space="small" />
          <TextboxMultiline
            rows={1}
            placeholder="Type here anything you want to ask CHAPI..."
            onValueInput={setMessage}
            value={message}
            variant="border"
          />
          {error && (
            <Fragment>
              <VerticalSpace space="extraSmall" />
              <span className="text-red-500">{error}</span>
              <VerticalSpace space="small" />
            </Fragment>
          )}
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

interface ChatTabProps {
  settings: Settings;
  onSaveSettings: (settings: WriteSettings) => void;
}

const ChatTab = ({ settings, onSaveSettings }: ChatTabProps) => {
  const [token, setToken] = useState("");

  const [chats, setChats] = useState<Record<string, MessageProps[]>>({});
  const [loaded, setLoaded] = useState(false);

  const [tab, setTab] = useState("");

  useEffect(() => {
    if (!loaded && Object.keys(settings).length > 0) {
      if (settings.openAIToken) {
        setToken(settings.openAIToken);
      }
      const chats = settings.chats ?? {
        "Chat 1": [],
      };
      setChats(chats);
      setTab(Object.keys(chats)[0]);
      setLoaded(true);
      console.log("asdasdas");
    }
  }, [settings, loaded]);

  const handleNewChat = useCallback(() => {
    const existingIds = Object.keys(chats).map((c) => c.split(" ")[1]);
    const newId = Math.max(...existingIds.map((i) => parseInt(i))) + 1;

    const newTab = `Chat ${newId}`;
    const newChats = Object.assign({}, chats, {
      [newTab]: [],
    });
    setChats(newChats);
    setTab(newTab);
  }, [chats]);

  const totalWords = useMemo(() => {
    return Object.values(chats).reduce((acc, messages) => {
      return (
        acc +
        messages.reduce(
          (acc, m) => acc + (m.text ? m.text.split(" ").length : 0),
          0
        )
      );
    }, 0);
  }, [chats]);

  const handleUpdateChats = useCallback(
    (messages: MessageProps[]) => {
      let newChats = Object.assign({}, chats, {
        [tab]: messages,
      });

      setChats(newChats);
      onSaveSettings({
        chats: newChats,
      });
    },
    [chats, tab]
  );

  const handleDeleteChat = useCallback(() => {
    const newChats = Object.assign({}, chats);
    newChats[tab] = [];

    setChats(newChats);
    onSaveSettings({
      chats: newChats,
    });
  }, [chats, tab]);

  return (
    <div>
      <VerticalSpace space="medium" />
      <div>
        <div className="flex items-center justify-between">
          <h1 className="text-[28px] font-black leading-10">Chat</h1>
          <div className="flex gap-5">
            <span>
              Usage: ~{USD.format((totalWords / 750) * 0.002)} (~$0.002 per 750
              words)
            </span>
            <span>Total words: {totalWords} </span>
          </div>
        </div>
        <VerticalSpace space="extraSmall" />
        <Text as={"p"}>
          It's finaly here! ChatGPT directly in Figma, no need to open other
          browser tabs anymore.
        </Text>
      </div>
      <VerticalSpace space="extraLarge" />
      <Tabs
        className="flex flex-wrap gap-3"
        value={tab}
        onValueChange={setTab}
        options={Object.keys(chats).map((name) => ({
          value: name,
          children: (
            <Chat
              messages={chats[name]}
              handleNewChat={handleNewChat}
              updateChats={handleUpdateChats}
              deleteChat={handleDeleteChat}
              token={token}
            />
          ),
        }))}
      />
    </div>
  );
};

function Plugin(data: unknown) {
  const [value, setValue] = useState("Chat");
  const [settings, setSettings] = useState<Settings>({});

  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    return on("LOAD_SETTINGS", (newSettings) => {
      setLoaded(true);
      setSettings({
        ...settings,
        ...newSettings,
      });
    });
  }, [settings]);

  const handleSaveSettings = useCallback(
    (newSettings: WriteSettings) => {
      emit<SaveSettingsHandler>(
        "SAVE_SETTINGS",
        {
          ...settings,
          ...newSettings,
        },
        "Chats saved locally."
      );
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
      {!settings.openAIToken && loaded && (
        <Banner icon={<IconInfo32 />}>
          Howdy! Don't forget to add your{" "}
          <Link href="https://beta.openai.com/account/api-keys" target="_blank">
            OpenAI token
          </Link>{" "}
          to settings to be able to chat with CHAPI.
        </Banner>
      )}

      <Tabs
        value={value}
        onValueChange={setValue}
        options={[
          {
            value: "Chat",
            children: (
              <SlideOver show>
                <ChatTab
                  settings={settings}
                  onSaveSettings={handleSaveSettings}
                />
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
