# Ethereal Dashboard (Customize Homepage Extension)

![React 18](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?logo=typescript&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-5+-646CFF?logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3+-06B6D4?logo=tailwindcss&logoColor=white) ![Chrome Extension V3](https://img.shields.io/badge/Chrome_Extension-V3-4285F4?logo=googlechrome&logoColor=white) ![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)

### Header & Branding
A premium, client-rendered homepage engine featuring offline machine learning workflows, zero backend dependencies, and a privacy-first local architecture.

---

## 1. Overview & Philosophy
Ethereal Dashboard is an ultra-premium, high-performance, privacy-first browser homepage engine designed to execute entirely at the client browser layer. The architecture operates under three strict operational zero-trust principles:
- **0 External Server Connections:** All computing overhead is sandboxed locally.
- **0 Telemetry / Data Tracking:** Complete user privacy with no metrics phone-home code.
- **0 External API Key Dependencies:** Eliminates reliance on paid or volatile third-party cloud engines.

Everything executes locally using client compute power, enabling fully deterministic behavior, ultra-low latency canvas rendering, and absolute user data sovereignty.

---

## 2. Technical Capabilities & Core Features

### Spatial Layout & Canvas Engine
- **Premium Glassmorphic UI:** Features draggable widget orchestration for advanced spatial desktop personalization.
- **Fluid Animation Physics:** Utilizes Framer Motion-driven interaction mechanics for seamless UI transitions.
- **GPU-Accelerated Styling:** Implements granular background media filters (blur, contrast, brightness) rendered via hardware-accelerated CSS pipelines to eliminate runtime repaint lag.

### Client-Side Machine Learning Inference
- **Local Foreground Isolation:** Implements fully offline AI subject isolation and background-removal workflows.
- **WASM Neural Network Pipeline:** Executes local WebAssembly neural network inference optimized to remain secure and compliant within strict Chrome Extension Manifest V3 Content Security Policy (CSP) boundaries.

### Spotlight Search Terminal
- **Programmable Slash Commands:** Intercepts and routes custom terminal triggers (such as `/yt`, `/gh`, and `/g`) straight from the UI.
- **Dynamic Asset Ingestion:** Features a processing string injection pipeline that dynamically renders raw local Base64 shortcut icons on active match detection.
- **Safe Dispatch Redirection:** Implements secure query-injection handling for clean, controlled search engine dispatches.

### DOM Hijacking Metadata Engine
- **Tab Layer Overrides:** Houses a local document-title override engine to bypass standard page restrictions.
- **Canvas-to-Favicon Streaming:** Handles real-time rendering of raw HTML5 canvas Base64 image streams directly into the physical browser tab favicon.
- **Zero Network Cost:** Executes visual tab identity updates instantly with zero network roundtrips.

---

## 3. Performance Telemetry Benchmarks

| Evaluation Scenario | Observed Memory Profile | Engineering Impact |
| :--- | :--- | :--- |
| **Baseline Overhead (1 Active Tab)** | ~35–40 MB RAM | Lean, near-zero residency footprint suited for daily homepage usage. |
| **Scalability Profile (15+ Active Tabs)** | ~38 MB per tab (Linear) | Stable, perfectly predictable scaling under aggressive multi-tab workloads. |
| **Heavy Industry Comparison** | 300–600 MB typical (YouTube/Discord) | Demonstrates major runtime resource efficiency gains over standard web layouts. |

### Architectural Optimization Drivers:
- **Lazy WebAssembly Allocation:** Context allocations for neural network engines remain dormant until explicitly invoked by user interaction.
- **Path-Agnostic Assets:** Local relative asset paths ensure efficient resource access paths across compiled storage modules.
- **State Tree Isolation:** Zero global-store state bloat ensures runtime memory pressure is tightly controlled with strict re-render boundaries.

---

## 4. Architecture & Data Persistence Details
- **Component Topology:** A clean, top-down state orchestrator manages the component tree with highly controlled re-render boundaries and clean data flow.
- **Storage Bridge Protocol:** An asynchronous abstraction layer performs automated handshakes with `chrome.storage.local` in production, falling back seamlessly to immediate `localStorage` during development.

---

## 5. Deployment & Installation Guide

### Automated Setup (Chromium-Family Browsers: Chrome, Brave, Edge, Opera)
The repository contains an automated orchestration pipeline located at `browser_exten/install_and_launch.bat`. The script requires elevated execution privileges ("Run as Administrator") and leverages Windows `%~dp0` relative pathing to guarantee proper project-root resolution across any machine.

When executed, the script automatically handles the following development pipeline operations:
1. Audits local system dependency and runtime prerequisites.
2. Executes clean package resolution and production compilation:
```bat
   pnpm install
   pnpm build
```
3. Natively injects the unpacked extension directory output directly into your active Chromium browser via launch target flags.

### Manual Developer Mode Fallback
1. Navigate to `chrome://extensions/` in your browser.
2. Enable the **Developer mode** toggle in the top-right corner.
3. Click **Load unpacked** in the top-left corner.
4. Select the compiled `/dist` directory located inside your project folder.

### Manual Warning-Free Setup (Mozilla Firefox)
Automated command-line loading in Firefox triggers external developer debugging hooks, which display a permanent "Browser is under remote control" alert bar across the browser layout. For a clean, pristine installation:
1. Launch Firefox normally.
2. Enter `about:debugging` into the URL address bar and press Enter.
3. Click on **This Firefox** on the left-hand navigation pane.
4. Select the **Load Temporary Add-on...** button.
5. Navigate into the compiled asset output directory (`browser_exten/Ui/dist/`) and select the `manifest.json` file.

---

## 6. License
This project is licensed under the MIT License — open source, permissive, and free to use.