# 🔧 ClawForge

**Visual configuration editor for [OpenClaw](https://openclaw.ai) — build your `openclaw.json` without touching raw JSON.**

> **[🚀 Try it live →](https://yourusername.github.io/clawforge/)**

---

## Features

| Section | What you can configure |
|---|---|
| 🔐 **Environment** | Environment variables (`${VAR}` syntax), version metadata |
| 🌐 **Gateway** | Mode, bind, port, auth (token/none), control UI, Tailscale |
| 📦 **Models** | Providers, API types, base URLs, keys, headers. Per-model: **reasoning**, **input types**, **context window**, **max tokens**, **cost** |
| 🤖 **Agents** | Primary/fallback models, subagent concurrency, typing mode, workspace, named agent personas with identities |
| 🔑 **Auth** | Authentication profiles (OAuth, API key, token) |
| 💬 **Channels** | Discord (multi-account, guilds), Telegram (bot token, chat IDs), WhatsApp (allowFrom, QR pairing), Twitch (OAuth) |
| 🌍 **Browser** | CDP connection, evaluate toggle, snapshot defaults |
| 🎨 **Interface** | UI theming (seam color), assistant name, messages (debounce, TTS), commands |
| 🛡️ **Skills** | Skill deny list with quick-add |
| 🔌 **Plugins** | Enable/disable plugins, tool cross-context settings |

### Highlights

- ⚡ **Real-time two-way sync** — visual editor ↔ JSON panel
- 📥 **Import** existing `openclaw.json` files
- 📋 **Copy** or **Download** the generated config
- 🎯 **Autocomplete** model references from configured providers
- 💎 **Premium glassmorphism UI** with smooth animations
- 📱 **Responsive** — works on desktop and mobile

## Quick Start

```bash
git clone https://github.com/yourusername/clawforge.git
cd clawforge
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Deploy to GitHub Pages

This repo includes a GitHub Actions workflow that auto-deploys on push to `main`.

1. Go to **Settings → Pages → Source** and select **GitHub Actions**
2. Push to `main` — the site deploys automatically

## Tech Stack

- [React](https://react.dev) + [Vite](https://vite.dev)
- [Framer Motion](https://www.framer.com/motion/) — animations
- [Lucide React](https://lucide.dev) — icons
- [react-simple-code-editor](https://github.com/react-simple-code-editor/react-simple-code-editor) + [PrismJS](https://prismjs.com) — syntax highlighting
- Vanilla CSS with glassmorphism design system

## How It Works

ClawForge runs entirely in your browser — **no server, no data sent anywhere**. Edit visually or type JSON directly; both stay in sync. When you're done, download the file and drop it into `~/.openclaw/openclaw.json`.

## License

MIT
