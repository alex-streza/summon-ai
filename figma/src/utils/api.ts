import { Image, Settings } from "../types";
import { urltoFile } from "./image";

const API_URL =
  process.env.NODE_ENV === "production"
    ? process.env.PRODUCTION_API_URL
    : process.env.LOCAL_API_URL;

const query = (config: Record<string, string | number | boolean | undefined>) =>
  Object.keys(config)
    .filter((key) => config[key] !== undefined)
    .map((key) => `${key}=${config[key]}`)
    .join("&");

export const apiClient = {
  getImages: async ({
    page,
    page_size = 9,
    user_id,
    search,
  }: {
    page: number;
    page_size?: number;
    search?: string;
    user_id?: string;
  }) => {
    const res = await fetch(
      `${API_URL}/images?${query({ page, page_size, search, user_id })}`,
      {
        method: "GET",
      }
    );
    const data = (await res.json()) as {
      images: Image[];
      count: number;
    };

    return data;
  },
  uploadImages: async (
    images: {
      b64: string;
      filename: string;
    }[],
    user: Omit<Settings["user"], "sessionId" | "color">,
    prompt?: string
  ) => {
    const res = await fetch(
      `${API_URL}/images/upload-url?count=${images.length}`,
      {
        method: "GET",
      }
    );
    const data = await res.json();

    const image_urls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const { b64, filename } = images[i];

      const formData = new FormData();
      formData.append("file", await urltoFile(b64, filename, "image/png"));

      const uploadRes = await fetch(data.urls[i], {
        method: "POST",
        body: formData,
      });

      const uploadData = await uploadRes.json();
      image_urls.push(uploadData.result.variants[0]);
    }

    fetch(`${API_URL}/images`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt ?? "variant",
        image_urls,
        user,
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data));
  },
  generateOpenjourney: async (body: {
    prompt?: string;
    width?: number;
    height?: number;
    num_outputs?: number;
  }) => {
    const res = await fetch(`${API_URL}/images/openjourney`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();

    return data;
  },
};
