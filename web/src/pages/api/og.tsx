import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const config = {
  runtime: "experimental-edge",
};

const Image = ({ url, prompt }: { url: string; prompt: string }) => {
  return (
    <div
      style={{
        background: "linear-gradient(141.83deg, #1A1A1A 0%, #363636 99.26%)",
      }}
      tw="flex flex-col items-center text-5xl text-center text-white w-full h-full p-12 font-bold"
    >
      <img width="256" height="256" src={url} tw="rounded-md" />
      <div tw="flex items-center justify-between">
        <svg
          width="48"
          height="48"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 22.6667L22.6667 17.3333H17.3334V8H26.6667V17.3333L24 22.6667H20ZM8.00004 22.6667L10.6667 17.3333H5.33337V8H14.6667V17.3333L12 22.6667H8.00004Z"
            fill="#FBFBFB"
          />
        </svg>
        <p tw="max-w-5xl">
          {prompt.length > 80 ? prompt.slice(0, 80) + "..." : prompt}
        </p>
        <svg
          width="48"
          height="48"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 22.6667L22.6667 17.3333H17.3334V8H26.6667V17.3333L24 22.6667H20ZM8.00004 22.6667L10.6667 17.3333H5.33337V8H14.6667V17.3333L12 22.6667H8.00004Z"
            fill="#FBFBFB"
          />
        </svg>
      </div>
    </div>
  );
};

export default async function handler(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const url = searchParams.get("url");
  const prompt = searchParams.get("prompt");

  if (!url || !prompt) {
    return new ImageResponse(
      <Image url="/images/og.png" prompt="Summon AI" />,
      {
        width: 1200,
        height: 630,
      }
    );
  }

  return new ImageResponse(<Image url={url} prompt={prompt} />, {
    width: 1200,
    height: 630,
  });
}
