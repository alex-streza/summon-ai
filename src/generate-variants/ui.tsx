import {
  Button,
  Columns,
  Container,
  Dropdown,
  Link,
  LoadingIndicator,
  Muted,
  render,
  Tabs,
  Text,
  Textbox,
  TextboxNumeric,
  VerticalSpace,
} from "@create-figma-plugin/ui";

import { emit, on } from "@create-figma-plugin/utilities";
import { Fragment, h } from "preact";
import { useCallback, useEffect, useState } from "preact/hooks";

import { CloseHandler, GenerateHandler } from "./types";

import "!../styles.css";
import { AboutTab } from "../components/AboutTab";
import { convertDataURIToBinary, urltoFile } from "../utils/image";
import { OPENAI_API_KEY, RESOLUTIONS } from "../constants/config";

const GenerateTab = ({ image, settings }: { image: string; settings: any }) => {
  const [count, setCount] = useState<number | null>(1);
  const [token, setToken] = useState("");
  const [resolution, setResolution] = useState(RESOLUTIONS[0]);
  const [loading, setLoading] = useState(false);
  const [countString, setCountString] = useState("1");
  const [error, setError] = useState("");

  useEffect(() => {
    if (settings.token) {
      setToken(settings.token);
    }
  }, [settings]);

  const handleGenerateButtonClick = useCallback(async () => {
    // DEBUGGING
    // const image = convertDataURIToBinary(
    // 	"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
    // );

    // emit<GenerateHandler>("GENERATE", resolution, [image], token);
    // return;

    if (count !== null && token != null) {
      setLoading(true);
      const formData = new FormData();
      formData.append("image", await urltoFile(image, "image", "image/png"));
      formData.append("size", resolution);
      formData.append("response_format", "b64_json");
      formData.append("n", count + "");
      fetch("https://api.openai.com/v1/images/variations", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + (OPENAI_API_KEY ?? token),
        },
        body: formData,
      })
        .then((response) => response.json())
        .then((res: { data: { b64_json: string }[] } | { error: any }) => {
          if ("data" in res) {
            const images: Uint8Array[] = [];
            res.data.forEach(({ b64_json }) => {
              const url = "data:image/png;base64," + b64_json;
              const image = convertDataURIToBinary(url);
              images.push(image);
            });
            emit<GenerateHandler>("GENERATE", resolution, images, token);
          } else {
            emit("NOTIFY", res.error.message);
            setError(res.error.message);
          }
        })
        .finally(() => setLoading(false));
    }
  }, [count, token, image, resolution]);

  const handleCloseButtonClick = useCallback(function () {
    emit<CloseHandler>("CLOSE");
  }, []);

  return (
    <Fragment>
      <VerticalSpace space="medium" />
      <h1 className="text-[28px] font-black leading-10">Generate variants</h1>
      <VerticalSpace space="extraSmall" />
      <Text as={"p"}>Time to summon some beautiful variants with AI</Text>
      <VerticalSpace space="extraLarge" />
      <img src={image} alt="image" width={100} height={100} />
      <VerticalSpace space="medium" />
      <Text>
        <Muted>Count</Muted>
      </Text>
      <VerticalSpace space="small" />
      <TextboxNumeric
        onNumericValueInput={setCount}
        onValueInput={setCountString}
        value={countString}
        variant="border"
      />
      <VerticalSpace space="large" />
      <Text>
        <Muted>Resolution</Muted>
      </Text>
      <VerticalSpace space="small" />
      <Dropdown
        options={RESOLUTIONS.map((resolution) => ({
          text: resolution,
          value: resolution,
        }))}
        onValueChange={setResolution}
        value={resolution}
        variant="border"
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
      <Columns space="extraSmall">
        <Button
          fullWidth
          onClick={handleGenerateButtonClick}
          disabled={loading || !prompt || !count || !token}
        >
          {loading && <LoadingIndicator color="brand" />}
          {!loading &&
            "Generate " +
              (count && count > 1 ? `${count} variants` : "variant")}
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
  const [image, setImage] = useState("");
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
            value: "Generate",
            children: <GenerateTab image={image} settings={settings} />,
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
