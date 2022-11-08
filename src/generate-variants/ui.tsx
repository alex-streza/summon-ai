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
	TextboxMultiline,
	TextboxNumeric,
	VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit } from "@create-figma-plugin/utilities";
import { Fragment, h } from "preact";
import { useCallback, useState } from "preact/hooks";

import { CloseHandler, GenerateHandler } from "./types";

const convertDataURIToBinary = (dataURI: string) =>
	Uint8Array.from(window.atob(dataURI.replace(/^data[^,]+,/, "")), (v) => v.charCodeAt(0));

const RESOLUTIONS = ["256x256", "512x512", "1024x1024"];

// DEBUGGING
const OPENAI_API_KEY = null;

const GenerateTab = () => {
	const [count, setCount] = useState<number | null>(1);
	const [token, setToken] = useState("");
	const [resolution, setResolution] = useState(RESOLUTIONS[0]);
	const [loading, setLoading] = useState(false);
	const [countString, setCountString] = useState("1");

	const handleGenerateButtonClick = useCallback(
		function () {
			if (count !== null && token != null) {
				setLoading(true);

				const image = convertDataURIToBinary(
					"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAABHNCSVQICAgIfAhkiAAAAAlwSFlzAAAApgAAAKYB3X3/OAAAABl0RVh0U29mdHdhcmUAd3d3Lmlua3NjYXBlLm9yZ5vuPBoAAANCSURBVEiJtZZPbBtFFMZ/M7ubXdtdb1xSFyeilBapySVU8h8OoFaooFSqiihIVIpQBKci6KEg9Q6H9kovIHoCIVQJJCKE1ENFjnAgcaSGC6rEnxBwA04Tx43t2FnvDAfjkNibxgHxnWb2e/u992bee7tCa00YFsffekFY+nUzFtjW0LrvjRXrCDIAaPLlW0nHL0SsZtVoaF98mLrx3pdhOqLtYPHChahZcYYO7KvPFxvRl5XPp1sN3adWiD1ZAqD6XYK1b/dvE5IWryTt2udLFedwc1+9kLp+vbbpoDh+6TklxBeAi9TL0taeWpdmZzQDry0AcO+jQ12RyohqqoYoo8RDwJrU+qXkjWtfi8Xxt58BdQuwQs9qC/afLwCw8tnQbqYAPsgxE1S6F3EAIXux2oQFKm0ihMsOF71dHYx+f3NND68ghCu1YIoePPQN1pGRABkJ6Bus96CutRZMydTl+TvuiRW1m3n0eDl0vRPcEysqdXn+jsQPsrHMquGeXEaY4Yk4wxWcY5V/9scqOMOVUFthatyTy8QyqwZ+kDURKoMWxNKr2EeqVKcTNOajqKoBgOE28U4tdQl5p5bwCw7BWquaZSzAPlwjlithJtp3pTImSqQRrb2Z8PHGigD4RZuNX6JYj6wj7O4TFLbCO/Mn/m8R+h6rYSUb3ekokRY6f/YukArN979jcW+V/S8g0eT/N3VN3kTqWbQ428m9/8k0P/1aIhF36PccEl6EhOcAUCrXKZXXWS3XKd2vc/TRBG9O5ELC17MmWubD2nKhUKZa26Ba2+D3P+4/MNCFwg59oWVeYhkzgN/JDR8deKBoD7Y+ljEjGZ0sosXVTvbc6RHirr2reNy1OXd6pJsQ+gqjk8VWFYmHrwBzW/n+uMPFiRwHB2I7ih8ciHFxIkd/3Omk5tCDV1t+2nNu5sxxpDFNx+huNhVT3/zMDz8usXC3ddaHBj1GHj/As08fwTS7Kt1HBTmyN29vdwAw+/wbwLVOJ3uAD1wi/dUH7Qei66PfyuRj4Ik9is+hglfbkbfR3cnZm7chlUWLdwmprtCohX4HUtlOcQjLYCu+fzGJH2QRKvP3UNz8bWk1qMxjGTOMThZ3kvgLI5AzFfo379UAAAAASUVORK5CYII="
				);

				const images = [image, image];
				emit<GenerateHandler>("GENERATE", count, token, resolution, images);

				// fetch("https://api.openai.com/v1/images/generations", {
				// 	method: "POST",
				// 	headers: {
				// 		"Content-Type": "application/json",
				// 		Authorization: "Bearer " + (OPENAI_API_KEY ?? token),
				// 	},
				// 	body: JSON.stringify({
				// 		prompt,
				// 		size: resolution,
				// 		response_format: "b64_json",
				// 		n: count,
				// 	}),
				// })
				// 	.then((response) => response.json())
				// 	.then(({ data }: { data: { b64_json: string }[] }) => {
				// 		const images: Uint8Array[] = [];

				// 		data.forEach(({ b64_json }) => {
				// 			const url = "data:image/png;base64," + b64_json;
				// 			const image = convertDataURIToBinary(url);
				// 			images.push(image);
				// 		});
				// 		emit<GenerateHandler>("GENERATE", prompt, count, token, resolution, images);
				// 	})
				// 	.finally(() => setLoading(false));
			}
		},
		[count, token, resolution]
	);

	const handleCloseButtonClick = useCallback(function () {
		emit<CloseHandler>("CLOSE");
	}, []);

	return (
		<Fragment>
			<VerticalSpace space="medium" />
			<Text style={{ fontSize: 28, lineHeight: "40px", fontWeight: 700 }} as={"h1"}>
				Welcome To Summon.AI
			</Text>
			<VerticalSpace space="extraSmall" />
			<Text as={"p"}>Time to summon some beautiful variants with AI</Text>
			<VerticalSpace space="extraLarge" />
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

const AboutTab = () => {
	return (
		<Fragment>
			<VerticalSpace space="medium" />
			<Text style={{ fontSize: 28, lineHeight: "40px", fontWeight: 700 }} as={"h1"}>
				About Summon.AI
			</Text>
			<VerticalSpace space="medium" />
			<Text style={{ fontSize: 16, lineHeight: "24px", fontWeight: 500 }} as={"p"}>
				Summon.AI is an open-source AI design tool allowing you to generate beautiful images, powered by{" "}
				<Link target="_blank" href="https://openai.com/dall-e-2/">
					DALL-E-2
				</Link>
				.
			</Text>
			<VerticalSpace space="large" />
			<div style={{ display: "flex", gap: 20 }}>
				<Link target="_blank" href="https://github.com/alex-streza/summon-ai">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
						<path fill="none" d="M0 0h24v24H0z" />
						<path
							fill="currentColor"
							d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"
						/>
					</svg>
				</Link>
				<Link target="_blank" href="https://twitter.com/alex_streza">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
						<path fill="none" d="M0 0h24v24H0z" />
						<path
							fill="currentColor"
							d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"
						/>
					</svg>
				</Link>
				<Link target="_blank" href="https://medium.com/@alex.streza">
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
						<path fill="none" d="M0 0h24v24H0z" />
						<path
							fill="currentColor"
							d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm13.3 12.94c-.1-.05-.15-.2-.15-.301V8.006c0-.1.05-.25.15-.351l.955-1.105V6.5H14.84l-2.56 6.478L9.366 6.5H5.852v.05l.903 1.256c.201.2.251.502.251.753v5.523c.05.302 0 .653-.15.954L5.5 16.894v.05h3.616v-.05L7.76 15.087c-.15-.302-.201-.603-.15-.954V9.11c.05.1.1.1.15.301l3.414 7.633h.05L14.54 8.76c-.05.3-.05.652-.05.904v5.925c0 .15-.05.25-.15.351l-1.005.954v.05h4.921v-.05l-.954-.954z"
						/>
					</svg>
				</Link>
			</div>
		</Fragment>
	);
};

function Plugin(data: any) {
	const [value, setValue] = useState("Summon");

	return (
		<Container space="medium">
			<Tabs
				value={value}
				onValueChange={setValue}
				options={[
					{
						value: "Summon",
						children: <GenerateTab />,
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
