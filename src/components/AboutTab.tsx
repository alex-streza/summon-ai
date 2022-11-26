import { Link, Text, VerticalSpace } from "@create-figma-plugin/ui";
import { Fragment, h } from "preact";

const BuyMeACoffeeWidget = () => {
  return (
    <a
      className="flex items-center gap-2 rounded-md bg-green-500 px-4 py-3 text-xs font-semibold text-gray-900 no-underline transition-all duration-200 hover:bg-green-600"
      href="https://www.buymeacoffee.com/alex_streza"
      target="_blank"
    >
      📹 Buy me a streaming kit
    </a>
  );
};

export const AboutTab = () => {
  return (
    <div className="relative h-full overflow-y-hidden">
      <VerticalSpace space="medium" />
      <h1 className="text-[28px] font-black leading-10">About Summon.AI</h1>
      <VerticalSpace space="medium" />
      <Text className="text-base font-medium leading-6" as={"p"}>
        Summon.AI is an open-source AI design tool allowing you to generate and
        edit beautiful images, powered by{" "}
        <Link target="_blank" href="https://openai.com/dall-e-2/">
          DALL-E-2
        </Link>
        .
        <br />
        <br />
        P.S. The token you use is not saved anywhere other than Figma's local
        storage.
      </Text>
      <VerticalSpace space="medium" />
      <Text className="text-base font-medium leading-6" as={"p"}>
        Check out more of my work and maybe follow me on:
      </Text>
      <VerticalSpace space="extraLarge" />
      <div className="flex items-center gap-3">
        <BuyMeACoffeeWidget />
        <Link target="_blank" href="https://github.com/alex-streza/summon-ai">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="32"
            height="32"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              fill="currentColor"
              d="M12 2C6.475 2 2 6.475 2 12a9.994 9.994 0 0 0 6.838 9.488c.5.087.687-.213.687-.476 0-.237-.013-1.024-.013-1.862-2.512.463-3.162-.612-3.362-1.175-.113-.288-.6-1.175-1.025-1.413-.35-.187-.85-.65-.013-.662.788-.013 1.35.725 1.538 1.025.9 1.512 2.338 1.087 2.912.825.088-.65.35-1.087.638-1.337-2.225-.25-4.55-1.113-4.55-4.938 0-1.088.387-1.987 1.025-2.688-.1-.25-.45-1.275.1-2.65 0 0 .837-.262 2.75 1.026a9.28 9.28 0 0 1 2.5-.338c.85 0 1.7.112 2.5.337 1.912-1.3 2.75-1.024 2.75-1.024.55 1.375.2 2.4.1 2.65.637.7 1.025 1.587 1.025 2.687 0 3.838-2.337 4.688-4.562 4.938.362.312.675.912.675 1.85 0 1.337-.013 2.412-.013 2.75 0 .262.188.574.688.474A10.016 10.016 0 0 0 22 12c0-5.525-4.475-10-10-10z"
            />
          </svg>
        </Link>
        <Link target="_blank" href="https://twitter.com/alex_streza">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="32"
            height="32"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              fill="currentColor"
              d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"
            />
          </svg>
        </Link>
        <Link target="_blank" href="https://medium.com/@alex.streza">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="32"
            height="32"
          >
            <path fill="none" d="M0 0h24v24H0z" />
            <path
              fill="currentColor"
              d="M4 3h16a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm13.3 12.94c-.1-.05-.15-.2-.15-.301V8.006c0-.1.05-.25.15-.351l.955-1.105V6.5H14.84l-2.56 6.478L9.366 6.5H5.852v.05l.903 1.256c.201.2.251.502.251.753v5.523c.05.302 0 .653-.15.954L5.5 16.894v.05h3.616v-.05L7.76 15.087c-.15-.302-.201-.603-.15-.954V9.11c.05.1.1.1.15.301l3.414 7.633h.05L14.54 8.76c-.05.3-.05.652-.05.904v5.925c0 .15-.05.25-.15.351l-1.005.954v.05h4.921v-.05l-.954-.954z"
            />
          </svg>
        </Link>
      </div>
      <img
        src="https://imagedelivery.net/_X5WqasCPTrKkrSW6EvwJg/9b8096c9-5cb0-49f2-01c1-dc1ce6575400/public"
        alt="Summon AI"
        className="about"
      />
    </div>
  );
};
