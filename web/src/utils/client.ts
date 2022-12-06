import got from "got";

export const client = got.extend({
  url: process.env.CLOUDFLARE_API_URL,
  prefixUrl: process.env.CLOUDFLARE_API_URL,
  headers: {
    Authorization: "Bearer " + process.env.CLOUDFLARE_API_TOKEN,
  },
});
