import fetch from "node-fetch";
import type { RequestInit } from "node-fetch";

const fetchClient = <Response>(endpoint: string, config: RequestInit) =>
  fetch([process.env.CLOUDFLARE_API_URL, endpoint].join("/"), {
    ...config,
    headers: {
      Authorization: "Bearer " + process.env.CLOUDFLARE_API_TOKEN,
      "Content-Type": "application/json",
      ...config.headers,
    },
  }).then((res) => res.json() as Promise<Response>);

const query = (config: Record<string, string | number | boolean>) =>
  Object.keys(config).join("&");

export const urltoFile = (url: string, filename: string, mimeType: string) => {
  return fetch(url)
    .then((res) => res.arrayBuffer())
    .then((buf) => new File([buf], filename, { type: mimeType }));
};

export const cloudflare = {
  getDirectUploadURL: async <T>() =>
    fetchClient("direct_upload", {
      method: "POST",
    }).then((res) => res as T),
  uploadImage: async <T>({
    url,
    filename,
    b64,
  }: {
    url: string;
    filename: string;
    b64: string;
  }) => {
    const formData = new FormData();
    formData.append("file", await urltoFile(b64, filename, "image/png"));

    const res = (await fetch(url, {
      method: "POST",
      body: formData,
    })) as any;

    const json = await res.json();

    return json as T;
  },
};
