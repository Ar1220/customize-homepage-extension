# Ethereal Dashboard (Customize Homepage Extension)

## 🔥 HEADER & BRANDING

> **A premium, client-rendered homepage engine with offline AI workflows, zero backend dependencies, and privacy-first architecture.**

![React 18](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-06B6D4?logo=tailwindcss&logoColor=white)
![Chrome Extension MV3](https://img.shields.io/badge/Chrome_Extension-MV3-4285F4?logo=googlechrome&logoColor=white)
![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

## ✨ OVERVIEW & PHILOSOPHY

**Ethereal Dashboard** is an ultra-premium, high-performance, privacy-first browser homepage engine designed to run fully at the browser layer.

- **0 external server connections**
- **0 telemetry/data tracking**
- **0 paid external API key dependencies**

Everything executes locally with client compute, enabling deterministic behavior, low latency, and full user data sovereignty.

## 🚀 KILLER FEATURES (With Emojis & Bold Typography)

### 🌌 **Premium Glassmorphic Canvas**
- Draggable widget orchestration for spatial personalization.
- Fluid **Framer Motion**-driven interaction mechanics.
- Granular background media filters (**blur / contrast / brightness**) rendered with hardware-accelerated CSS pipelines.

### ⚡ **Client-Side Machine Learning Inference**
- Fully offline AI foreground-isolation and background-removal workflows.
- Local **WebAssembly neural network** inference designed to remain compliant with strict extension CSP boundaries.

### 🐚 **Spotlight Search Terminal**
- Programmable slash commands such as **`/yt`**, **`/gh`**, and **`/g`**.
- String interception and routing pipelines with dynamically rendered base64 shortcut icons.
- Safe query-injection redirect handling for fast, controlled search dispatch.

### 👁 **DOM Hijacking Metadate Engine**
- Local document-title override engine.
- Real-time rendering of raw canvas base64 image streams directly into browser tab favicons.
- Zero network roundtrips for metadata and visual tab identity updates.

## 📊 PERFORMANCE TELEMETRY BENCHMARKS

| Scenario | Observed Memory Profile | Why It Matters |
|---|---:|---|
| Baseline overhead (1 active tab) | **~35–40MB RAM** | Lean default residency for daily homepage usage. |
| Scalability profile (15+ active tabs) | **~38MB per tab (linear)** | Predictable scaling under multi-tab workloads. |
| Heavy-page comparison (YouTube/Discord) | **300–600MB typical** | Demonstrates major efficiency gains in extension workload design. |

**Optimization drivers:**
- Lazy WebAssembly context allocation.
- Local relative asset paths for efficient resource access.
- Zero global-store state bloat, keeping runtime memory pressure tightly controlled.

## 🛠️ TECHNICAL ARCHITECTURE & DEEP DIVE

- **Component topology:** A clean, top-down state orchestrator manages the component tree with deterministic data flow and controlled re-render boundaries.
- **Storage Bridge Protocol:** An asynchronous abstraction layer performs automated handshakes with `chrome.storage.local` in production and falls back to immediate `localStorage` during development.

## ⚡ ONE-CLICK AUTOMATED DEPLOYMENT (Windows CLI Guide)

The `install_and_launch.bat` automation pipeline is designed for elevated execution (Run as Administrator) and uses `%~dp0` relative pathing to guarantee correct project-root resolution.

### What it does automatically
- Audits local dependency/runtime prerequisites.
- Executes:

```bat
pnpm install
pnpm build
```

- Force-injects the unpacked extension output into active Chromium-family browsers (Chrome, Edge, Brave) via launch target flags.

### Manual Developer Mode fallback
1. Open `chrome://extensions`
2. Enable **Developer mode**
3. Select **Load unpacked**
4. Choose the `/dist` directory

## 📜 LICENSE

**MIT License** — open source and free to use.
