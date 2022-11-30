import { pino } from "pino";
import fastify from "fastify";
import got from "got-cjs";
import { urltoFile } from "./utils/images";
import * as dotenv from "dotenv";
import cors from "@fastify/cors";
dotenv.config();

const schema = {
	type: "object",
	required: ["PORT"],
	properties: {
		PORT: {
			type: "string",
			default: 3001,
		},
	},
};

const server = fastify({
	logger: pino({ level: "info" }),
});

server.register(cors, {
	origin: false,
});

const client = got.extend({
	url: process.env.CLOUDFLARE_API_URL,
	prefixUrl: process.env.CLOUDFLARE_API_URL,
	headers: {
		Authorization: "Bearer " + process.env.CLOUDFLARE_API_TOKEN,
	},
});

server.setErrorHandler(function (error, request, reply) {
	console.log("error", error);
	if (error instanceof fastify.errorCodes.FST_ERR_BAD_STATUS_CODE) {
		// Log error
		this.log.error(error);
		// Send error response
		reply.status(500).send({ ok: false });
	}
});

server.addHook("onSend", async function (request, reply) {
	reply.headers({
		"Access-Control-Allow-Origin": "*",
		"Access-Control-Allow-Methods": "GET,PUT,POST,DELETE",
		"Access-Control-Allow-Headers": "Content-Type",
	});
});

server.get("/images/upload-url", async (request, reply) => {
	const { count = 1 } = request.query;

	const urls = [];

	for (let i = 0; i < count; i++) {
		const {
			result: { uploadURL },
		} = await client.post("direct_upload").json();

		urls.push(uploadURL);
	}

	reply.send(JSON.stringify({ urls }));
});

server.listen({ port: parseInt(process.env.PORT ?? "3003") }, (err, address) => {
	if (err) {
		console.error(err);
		process.exit(1);
	}
	console.log(`Server listening at ${address}`);
});
