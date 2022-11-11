![image](https://user-images.githubusercontent.com/72100849/201352774-9e52dc84-8ad1-433f-972f-343ffb828273.png)

# Summon.AI

## About

Summon.AI is an open-source AI design tool (Figma Plugin) allowing you to generate beautiful images, powered by [DALL-E-2](https://openai.com/dall-e-2/).

## Features

- ❤️ Powered by OpenAI DALL-E-2
- ⭐️ Minimalist Figma based UI
- 🪶 Generations + Variants API + Edit (mask) integration
- 🧐 Supports count, resolution and prompt params
- ⚡️ Free & open-source

## Quick Start

To get it running, follow the steps API:
https://beta.openai.com/docs/guides/images/introduction?lang=node.jsld the plugin:

```
$ npm run build
```

This will generate a [`manifest.json`](https://figma.com/plugin-docs/manifest/) file and a `build/` directory containing the JavaScript bundle(s) for the plugin.

To watch for code changes and rebuild the plugin automatically:

```
$ npm run watch
```

### Install the plugin

1. In the Figma desktop app, open a Figma document.
2. Search for and run `Import plugin from manifest…` via the Quick Actions search bar.
3. Select the `manifest.json` file that was generated by the `build` script.

### Debugging

Use `console.log` statements to inspect values in your code.

To open the developer console, search for and run `Open Console` via the Quick Actions search bar.

## See also

- [Create Figma Plugin docs](https://yuanqing.github.io/create-figma-plugin/)
- [`yuanqing/figma-plugins`](https://github.com/yuanqing/figma-plugins#readme)

Official docs and code samples from Figma:

- [Plugin API docs](https://figma.com/plugin-docs/)
- [`figma/plugin-samples`](https://github.com/figma/plugin-samples#readme)

OpenAI API Docs for DALL-E-2

- [OpenAI Dall-E-2 API](https://beta.openai.com/docs/guides/images/introduction?lang=node.js)

## Contributing

Any help is appreciated, feel free to open an issue or a PR!

- [x] Edit image with mask + prompt
- [x] Generate variations for given image
- [x] Cleanup positioning logic
- [x] Cleanup styles, maybe Tailwind?

## Development guide

_This plugin is built with [Create Figma Plugin](https://yuanqing.github.io/create-figma-plugin/)._

### Pre-requisites

- [Node.js](https://nodejs.org) – v16
- [Figma desktop app](https://figma.com/downloads/)
- [OpenAI DALL-E-2 Token](https://beta.openai.com/account/api-keys)
