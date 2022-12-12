![image](https://user-images.githubusercontent.com/72100849/201352774-9e52dc84-8ad1-433f-972f-343ffb828273.png)

# Summon.AI

[<img align="left" alt="producthunt" src="https://img.shields.io/badge/producthunt-%23d55124.svg?&style=for-the-badge&logo=producthunt&logoColor=white" />](https://www.producthunt.com/posts/summon-ai)
[<img align="left" alt="gumroad" src="https://img.shields.io/badge/gumroad-%23ff90e8.svg?&style=for-the-badge&logo=gumroad&logoColor=black" />](https://alexstreza.gumroad.com/l/summon-ai)
[<img align="left" alt="figma" src="https://img.shields.io/badge/figma%20-%231ABCFE.svg?&style=for-the-badge&logo=figma&logoColor=white" />](https://www.figma.com/community/plugin/1172891596048319817/Summon.AI)

<br>

## About

Summon.AI is an open-source AI design tool (Figma Plugin & website coming soon) allowing you to generate beautiful images, powered by [DALL-E-2](https://openai.com/dall-e-2/).

## Features

- ❤️ Powered by OpenAI DALL-E-2
- ⭐️ Minimalist Figma based UI
- 🪶 Generations + Variants API + Edit (mask) integration
- 🧐 Supports count, resolution and prompt params
- 🖼️ Discover generated images and prompts
- ⚡️ Free & open-source

## Quick Start

It uses [turborepo](https://turbo.build/) for managing the pnpm workspace and consists of 2 main packages, web (Next.JS Website doubling as the API)
and the Figma plugin. (Other integrations coming soon)

1. Install [pnpm](https://pnpm.io/installation)

2. Add .env

3. Install dependencies
```
$ pnpm i
```

4. Run locally
```
$ pnpm dev
```

## See also

- [Create T3 App](https://create.t3.gg/)
- [Create Figma Plugin docs](https://yuanqing.github.io/create-figma-plugin/)
- [`yuanqing/figma-plugins`](https://github.com/yuanqing/figma-plugins#readme)

Official docs and code samples from Figma:

- [Plugin API docs](https://figma.com/plugin-docs/)
- [`figma/plugin-samples`](https://github.com/figma/plugin-samples#readme)

OpenAI API Docs for DALL-E-2

- [OpenAI Dall-E-2 API](https://beta.openai.com/docs/guides/images/introduction?lang=node.js)

Next.JS related docs

- [Next 13](https://nextjs.org/blog/next-13)
- [Beta Docs](https://beta.nextjs.org/docs)

## Contributing

Any help is appreciated, check open issues 🚀, also feel free to open another issue or a PR!

## Development guide

_This plugin is built with [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/)._
_The API and showcase website is built using [Create T3 App](https://create.t3.gg/)._

### Pre-requisites

- [Node.js](https://nodejs.org) – v16
- [pnpm](https://pnpm.io/installation)
- [Figma desktop app](https://figma.com/downloads/)
- [OpenAI DALL-E-2 Token](https://beta.openai.com/account/api-keys)
