import {
	Button,
	Columns,
	Container,
	Link,
	LoadingIndicator,
	Muted,
	render,
	Tabs,
	Text,
	Textbox,
	TextboxMultiline,
	VerticalSpace,
} from "@create-figma-plugin/ui";
import { emit, on } from "@create-figma-plugin/utilities";
import Konva from "konva";
import { Stage } from "konva/lib/Stage";
import { Vector2d } from "konva/lib/types";
import { Fragment, h } from "preact";
import { useCallback, useEffect, useRef, useState } from "preact/hooks";

import { CloseHandler, ExportHandler } from "./types";

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

const secondaryButtonClassName =
	"bg-white px-4 py-2 text-black cursor-pointer outline-none border bg-white hover:bg-slate-500 rounded-lg";

const GenerateTab = ({ image, settings }: { image: string; settings: any }) => {
	const [token, setToken] = useState("");
	const [resolution, setResolution] = useState(RESOLUTIONS[1]);
	const [loading, setLoading] = useState(false);
	const [imageLoading, setImageLoading] = useState(true);
	const [prompt, setPrompt] = useState("");
	const [showCursor, setShowCursor] = useState(false);
	const [reset, setReset] = useState(0);
	const [generatedImage, setGeneratedImage] = useState<string | null>();
	const [cursorPosition, setCursorPosition] = useState({
		x: 0,
		y: 0,
	});
	const [viewOriginal, setViewOriginal] = useState(false);

	const size = parseInt(resolution.split("x")[0]);

	const stageRef = useRef<Stage>();

	const handleEdit = useCallback(async () => {
		if (token != null && prompt && stageRef.current) {
			setLoading(true);
			const formData = new FormData();

			formData.append("image", await urltoFile(image, "image", "image/png"));
			formData.append("mask", await urltoFile(stageRef.current.toDataURL(), "mask", "image/png"));
			formData.append("size", resolution);
			formData.append("prompt", prompt);
			formData.append("response_format", "b64_json");

			fetch("https://api.openai.com/v1/images/edits", {
				method: "POST",
				headers: {
					Authorization: "Bearer " + (OPENAI_API_KEY ?? token),
				},
				body: formData,
			})
				.then((response) => response.json())
				.then(({ data }: { data: { b64_json: string }[] }) => {
					const url = "data:image/png;base64," + data[0].b64_json;
					setGeneratedImage(url);
				})
				.finally(() => setLoading(false));
		}
	}, [token, resolution, prompt]);

	const handleCloseButtonClick = useCallback(function () {
		emit<CloseHandler>("CLOSE");
	}, []);

	const handleExport = useCallback(
		function () {
			if (generatedImage) {
				const image: Uint8Array = convertDataURIToBinary(generatedImage);

				emit<ExportHandler>("EXPORT", image);
			}
		},
		[generatedImage]
	);

	const handleMouseMove = useCallback(function (event: MouseEvent) {
		setCursorPosition({
			x: event.offsetX,
			y: event.offsetY,
		});
		setShowCursor(true);
	}, []);

	const handleReset = useCallback(
		function () {
			setGeneratedImage(null);
			setReset(reset + 1);
		},
		[reset]
	);

	useEffect(() => {
		if (settings.token) {
			setToken(settings.token);
		}
	}, [settings]);

	useEffect(() => {
		stageRef.current = new Konva.Stage({
			container: "image-editor",
			width: size,
			height: size,
		});

		const layer = new Konva.Layer();
		stageRef.current.add(layer);

		let canvas = document.createElement("canvas");
		canvas.width = size;
		canvas.height = size;

		let canvasImage = new Konva.Image({
			image: canvas,
			x: 0,
			y: 0,
		});
		layer.add(canvasImage);

		const context = canvas.getContext("2d");

		if (context) {
			let imageObj = new Image();
			imageObj.src = image;
			imageObj.onload = function () {
				context.drawImage(imageObj, 0, 0, size, size);
				canvasImage.image(canvas);
				layer.draw();
				setImageLoading(false);
			};

			context.strokeStyle = "#000000";
			context.lineJoin = "round";
			context.lineWidth = 50;

			let isPaint = false;
			let lastPointerPosition: Vector2d | null = null;

			canvasImage.on("mousedown touchstart", function () {
				isPaint = true;
				if (stageRef.current) lastPointerPosition = stageRef.current.getPointerPosition();
			});

			stageRef.current.on("mouseup touchend", function () {
				isPaint = false;
			});

			stageRef.current.on("mousemove touchmove", function () {
				if (!isPaint) return;

				// context.globalCompositeOperation = "source-over";
				context.globalCompositeOperation = "destination-out";
				context.beginPath();

				if (lastPointerPosition && stageRef.current) {
					let localPos = {
						x: lastPointerPosition.x - canvasImage.x(),
						y: lastPointerPosition.y - canvasImage.y(),
					};
					context.moveTo(localPos.x, localPos.y);
					let pos = stageRef.current.getPointerPosition();
					if (pos) {
						localPos = {
							x: pos.x - canvasImage.x(),
							y: pos.y - canvasImage.y(),
						};
						context.lineTo(localPos.x, localPos.y);
						context.closePath();
						context.stroke();

						lastPointerPosition = pos;
						layer.batchDraw();
					}
				}
			});
		}

		stageRef.current.toDataURL();
	}, [image, reset]);

	return (
		<Fragment>
			<VerticalSpace space="medium" />
			<h1 className="text-[28px] leading-10 font-black">Edit image</h1>
			<VerticalSpace space="extraSmall" />
			<Text as={"p"}>
				Draw a mask where you want to edit. The prompt should describe the full new image, not just the erased area.
			</Text>
			<VerticalSpace space="extraLarge" />
			<div
				className="relative border border-[#5f5f5f]"
				style={{
					width: size,
					height: size,
				}}>
				{imageLoading && (
					<div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-1/2">
						<LoadingIndicator />
					</div>
				)}
				{!generatedImage && (
					<div id="image-editor" onMouseLeave={() => setShowCursor(false)} onMouseMove={handleMouseMove}>
						{showCursor && (
							<div
								className="w-[50px] h-[50px] rounded-full border-2 border-white absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
								style={{
									top: cursorPosition.y,
									left: cursorPosition.x,
								}}></div>
						)}
					</div>
				)}
				{generatedImage && (
					<Fragment>
						<img
							src={viewOriginal ? image : generatedImage}
							width={size}
							height={size}
							style={{
								border: "none !important",
							}}
						/>
						<div
							style={{
								position: "absolute",
								top: 20,
								right: 20,
							}}>
							<button className={secondaryButtonClassName} onClick={handleReset}>
								<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
									<g clip-path="url(#clip0_303_475)">
										<path
											d="M15.4475 16.3057C13.9353 17.616 12.0008 18.336 9.99996 18.3332C5.39746 18.3332 1.66663 14.6023 1.66663 9.99984C1.66663 5.39734 5.39746 1.6665 9.99996 1.6665C14.6025 1.6665 18.3333 5.39734 18.3333 9.99984C18.3333 11.7798 17.775 13.4298 16.825 14.7832L14.1666 9.99984H16.6666C16.6665 8.46334 16.1356 6.97406 15.1639 5.78391C14.1921 4.59377 12.839 3.77583 11.3336 3.46847C9.82813 3.16111 8.26274 3.38319 6.90219 4.09714C5.54165 4.8111 4.46948 5.9731 3.86706 7.38657C3.26465 8.80005 3.16896 10.3782 3.5962 11.8541C4.02344 13.33 4.94737 14.613 6.21169 15.4861C7.47602 16.3592 9.00312 16.7688 10.5347 16.6456C12.0662 16.5223 13.5082 15.8739 14.6166 14.8098L15.4475 16.3057Z"
											fill="black"
										/>
									</g>
									<defs>
										<clipPath id="clip0_303_475">
											<rect width="20" height="20" fill="white" />
										</clipPath>
									</defs>
								</svg>
							</button>
						</div>
						<div className="absolute bottom-5 right-5 gap-3 flex">
							<button className={secondaryButtonClassName} onClick={() => setViewOriginal(!viewOriginal)}>
								<div className="flex gap-2 items-center">
									<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<g clip-path="url(#clip0_305_491)">
											<path
												d="M10.5 2.5C14.9933 2.5 18.7316 5.73333 19.5158 10C18.7325 14.2667 14.9933 17.5 10.5 17.5C6.00663 17.5 2.2683 14.2667 1.48413 10C2.26746 5.73333 6.00663 2.5 10.5 2.5ZM10.5 15.8333C12.1995 15.833 13.8486 15.2557 15.1773 14.196C16.5061 13.1363 17.4357 11.6569 17.8141 10C17.4343 8.34442 16.5041 6.86667 15.1755 5.80835C13.8469 4.75004 12.1986 4.17377 10.5 4.17377C8.80138 4.17377 7.15304 4.75004 5.82444 5.80835C4.49585 6.86667 3.5656 8.34442 3.1858 10C3.56421 11.6569 4.49386 13.1363 5.82259 14.196C7.15131 15.2557 8.80041 15.833 10.5 15.8333ZM10.5 13.75C9.5054 13.75 8.55158 13.3549 7.84832 12.6516C7.14505 11.9484 6.74997 10.9946 6.74997 10C6.74997 9.00544 7.14505 8.05161 7.84832 7.34835C8.55158 6.64509 9.5054 6.25 10.5 6.25C11.4945 6.25 12.4484 6.64509 13.1516 7.34835C13.8549 8.05161 14.25 9.00544 14.25 10C14.25 10.9946 13.8549 11.9484 13.1516 12.6516C12.4484 13.3549 11.4945 13.75 10.5 13.75ZM10.5 12.0833C11.0525 12.0833 11.5824 11.8638 11.9731 11.4731C12.3638 11.0824 12.5833 10.5525 12.5833 10C12.5833 9.44747 12.3638 8.91756 11.9731 8.52686C11.5824 8.13616 11.0525 7.91667 10.5 7.91667C9.94743 7.91667 9.41753 8.13616 9.02683 8.52686C8.63613 8.91756 8.41663 9.44747 8.41663 10C8.41663 10.5525 8.63613 11.0824 9.02683 11.4731C9.41753 11.8638 9.94743 12.0833 10.5 12.0833Z"
												fill="black"
											/>
										</g>
										<defs>
											<clipPath id="clip0_305_491">
												<rect width="20" height="20" fill="white" transform="translate(0.5)" />
											</clipPath>
										</defs>
									</svg>
									<span>{viewOriginal ? "View generated" : "View original"}</span>
								</div>
							</button>
							<button className={secondaryButtonClassName} onClick={handleExport}>
								<div className="flex gap-2 items-center">
									<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
										<g clip-path="url(#clip0_305_496)">
											<path
												d="M4.52329 17.5L4.50663 17.5167L4.48913 17.5H2.99329C2.77397 17.4998 2.56371 17.4125 2.4087 17.2573C2.25369 17.1022 2.16663 16.8918 2.16663 16.6725V3.3275C2.16815 3.10865 2.25571 2.89918 2.41039 2.74435C2.56506 2.58951 2.77444 2.50175 2.99329 2.5H18.0066C18.4633 2.5 18.8333 2.87083 18.8333 3.3275V16.6725C18.8318 16.8914 18.7442 17.1008 18.5895 17.2557C18.4349 17.4105 18.2255 17.4983 18.0066 17.5H4.52329ZM17.1666 12.5V4.16667H3.83329V15.8333L12.1666 7.5L17.1666 12.5ZM17.1666 14.8567L12.1666 9.85667L6.18996 15.8333H17.1666V14.8567ZM7.16663 9.16667C6.7246 9.16667 6.30067 8.99107 5.98811 8.67851C5.67555 8.36595 5.49996 7.94203 5.49996 7.5C5.49996 7.05797 5.67555 6.63405 5.98811 6.32149C6.30067 6.00893 6.7246 5.83333 7.16663 5.83333C7.60865 5.83333 8.03258 6.00893 8.34514 6.32149C8.6577 6.63405 8.83329 7.05797 8.83329 7.5C8.83329 7.94203 8.6577 8.36595 8.34514 8.67851C8.03258 8.99107 7.60865 9.16667 7.16663 9.16667Z"
												fill="black"
											/>
										</g>
										<defs>
											<clipPath id="clip0_305_496">
												<rect width="20" height="20" fill="white" transform="translate(0.5)" />
											</clipPath>
										</defs>
									</svg>
									<span>Export</span>
								</div>
							</button>
						</div>
					</Fragment>
				)}
			</div>
			<VerticalSpace space="large" />
			<Text>
				<Muted>Prompt</Muted>
			</Text>
			<VerticalSpace space="small" />
			<TextboxMultiline
				rows={2}
				placeholder="a photo of a happy corgi puppy sitting and facing forward, studio light, longshot"
				onValueInput={setPrompt}
				value={prompt}
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
			{!generatedImage && (
				<Columns space="extraSmall">
					<Button fullWidth onClick={handleEdit} disabled={loading || imageLoading || !prompt || !token}>
						{loading && <LoadingIndicator color="brand" />}
						{!loading && "Edit image"}
					</Button>
					<Button fullWidth onClick={handleCloseButtonClick} secondary>
						Close
					</Button>
				</Columns>
			)}
			<VerticalSpace space="medium" />
		</Fragment>
	);
};

function Plugin(data: any) {
	const [value, setValue] = useState("Edit");
	const [image, setImage] = useState<string>("");
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
						value: "Edit",
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
