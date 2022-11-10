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

const convertDataURIToBinary = (dataURI: string) =>
	Uint8Array.from(window.atob(dataURI.replace(/^data[^,]+,/, "")), (v) => v.charCodeAt(0));

const urltoFile = (url: string, filename: string, mimeType: string) => {
	return fetch(url)
		.then(function (res) {
			return res.arrayBuffer();
		})
		.then(function (buf) {
			return new File([buf], filename, { type: mimeType });
		});
};

const RESOLUTIONS = ["256x256", "512x512", "1024x1024"];

// DEBUGGING
const OPENAI_API_KEY = null;

const GenerateTab = ({ image, settings }: { image: string; settings: any }) => {
	const [count, setCount] = useState<number | null>(1);
	const [token, setToken] = useState("");
	const [resolution, setResolution] = useState(RESOLUTIONS[0]);
	const [loading, setLoading] = useState(false);
	const [countString, setCountString] = useState("1");

	useEffect(() => {
		if (settings.token) {
			setToken(settings.token);
		}
	}, [settings]);

	const handleGenerateButtonClick = useCallback(async () => {
		if (count !== null && token != null) {
			setLoading(true);
			const formData = new FormData();

			formData.append("image", await urltoFile(image, "image", "image/png"));
			formData.append("size", resolution);
			formData.append("response_format", "b64_json");
			formData.append("n", count + "");

			// fetch("https://api.openai.com/v1/images/variations", {
			// 	method: "POST",
			// 	headers: {
			// 		Authorization: "Bearer " + (OPENAI_API_KEY ?? token),
			// 	},
			// 	body: formData,
			// })
			// 	.then((response) => response.json())
			// 	.then(({ data }: { data: { b64_json: string }[] }) => {
			// 		const images: Uint8Array[] = [];

			// 		data.forEach(({ b64_json }) => {
			// 			const url = "data:image/png;base64," + b64_json;
			// 			const image = convertDataURIToBinary(url);
			// 			images.push(image);
			// 		});
			// 		emit<GenerateHandler>("GENERATE", resolution, images, token);
			// 	})
			// 	.finally(() => setLoading(false));
			setLoading(false);
			emit<GenerateHandler>("GENERATE", resolution, [], token);
		}
	}, [count, token, resolution]);

	const handleCloseButtonClick = useCallback(function () {
		emit<CloseHandler>("CLOSE");
	}, []);

	return (
		<Fragment>
			<VerticalSpace space="medium" />
			<h1 className="text-[28px] leading-10 font-black">Generate variants</h1>
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
			<Textbox placeholder="Paste secret DALL-E-2 token" onValueInput={setToken} value={token} variant="border" />
			<VerticalSpace space="extraSmall" />
			<Link href="https://openai.com/api/pricing/" target="_blank">
				Get a DALL-E-2 token
			</Link>
			<VerticalSpace space="extraLarge" />
			<Columns space="extraSmall">
				<Button
					fullWidth
					onClick={handleGenerateButtonClick}
					disabled={
						loading
						// || !prompt || !count || !token
					}>
					{loading && <LoadingIndicator color="brand" />}
					{!loading && "Generate " + (count && count > 1 ? `${count} variants` : "variant")}
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
