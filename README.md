# Ethereal Dashboard

<div align="left">
  <p><strong>Customize Homepage Extension</strong></p>
  <img src="https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5+-3178c6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5+-646cff?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3+-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Chrome_Extension-V3-4285f4?style=flat-square&logo=google-chrome" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</div>

<br/>

### Header & Branding
A premium, client-rendered homepage engine featuring offline machine learning workflows, zero backend dependencies, and a privacy-first local architecture.

---

<br/>
<br/>

## 1. Overview & Philosophy

Ethereal Dashboard is an ultra-premium, high-performance, privacy-first browser homepage engine designed to execute entirely at the client browser layer. The core system architecture operates under three strict operational zero-trust principles:

> ### 🛑 The Zero-Trust Operational Framework
> * **0 External Server Connections:** All computing overhead and asset assets are sandboxed entirely within the local runtime context.
> * **0 Telemetry / Data Tracking:** Guarantees absolute user privacy with no underlying metrics phone-home code or analytical interception hooks.
> * **0 External API Key Dependencies:** Eliminates operational reliance on paid, rate-limited, or volatile third-party cloud engines.

Everything executes locally using client compute power, enabling fully deterministic behavior, ultra-low latency canvas rendering, and absolute user data sovereignty.

---

<br/>
<br/>

## 2. Technical Capabilities & Core Features

### 💻 Spatial Layout & Canvas Engine
* **Premium Glassmorphic UI:** Features fluid, draggable widget orchestration for advanced spatial desktop personalization.
* **Fluid Animation Physics:** Utilizes Framer Motion-driven interaction mechanics for natural structural UI transitions.
* **GPU-Accelerated Styling:** Implements granular background media filters (blur, contrast, brightness) rendered via hardware-accelerated CSS pipelines to eliminate runtime repaint lag.

<br/>

### 🧠 Client-Side Machine Learning Inference
* **Local Foreground Isolation:** Implements fully offline AI subject isolation and background-removal workflows for uploaded custom imagery.
* **WASM Neural Network Pipeline:** Executes local WebAssembly neural network inference optimized to remain secure and compliant within strict Chrome Extension Manifest V3 Content Security Policy (CSP) boundaries.

<br/>

### 🐚 Spotlight Search Terminal
* **Programmable Slash Commands:** Intercepts and routes custom terminal triggers (such as `/yt`, `/gh`, and `/g`) straight from the interactive search fields.
* **Dynamic Asset Ingestion:** Features a processing string injection pipeline that dynamically renders raw local Base64 shortcut icons on active command match detection.
* **Safe Dispatch Redirection:** Implements secure query-injection handling for clean, controlled target search engine dispatches.

<br/>

### 👁️ DOM Hijacking Metadata Engine
* **Tab Layer Overrides:** Houses a local document-title override engine to bypass standard browser tab text restrictions.
* **Canvas-to-Favicon Streaming:** Handles real-time rendering of raw HTML5 canvas Base64 image streams directly into the physical browser tab favicon.
* **Zero Network Cost:** Executes visual tab identity updates instantly with zero network roundtrips or static hosting requirements.

---

<br/>
<br/>

## 3. Performance Telemetry Benchmarks

<table width="100%">
  <thead>
    <tr style="background-color: rgba(255,255,255,0.05);">
      <th align="left" width="30%">Evaluation Scenario</th>
      <th align="left" width="25%">Observed Memory Profile</th>
      <th align="left" width="45%">Engineering Impact</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td><strong>Baseline Overhead (1 Active Tab)</strong></td>
      <td><code>~35–40 MB RAM</code></td>
      <td>Lean, near-zero residency footprint suited for daily homepage usage.</td>
    </tr>
    <tr>
      <td><strong>Scalability Profile (15+ Active Tabs)</strong></td>
      <td><code>~38 MB per tab (Linear)</code></td>
      <td>Stable, perfectly predictable scaling under aggressive multi-tab workloads.</td>
    </tr>
    <tr>
      <td><strong>Heavy Industry Comparison</strong></td>
      <td><code>300–600 MB typical</code></td>
      <td>Demonstrates major runtime resource efficiency gains over standard bloated web layouts.</td>
    </tr>
  </tbody>
</table>

### Architectural Optimization Drivers:
* **Lazy WebAssembly Allocation:** Context allocations for local neural network engines remain completely dormant until explicitly invoked by user interaction.
* **Path-Agnostic Assets:** Local relative asset paths ensure efficient resource access paths across compiled storage modules, regardless of deployment environment.
* **State Tree Isolation:** Zero global-store state bloat ensures runtime memory pressure is tightly controlled with strict component re-render boundaries.

---

<br/>
<br/>

## 4. Architecture & Data Persistence Details

* **Component Topology:** A clean, top-down state orchestrator manages the component tree with highly controlled re-render boundaries and clean, deterministic data flows.
* **Storage Bridge Protocol:** An asynchronous abstraction layer performs automated handshakes with `chrome.storage.local` in production environments, falling back seamlessly to immediate browser `localStorage` during local development workflows.

---

<br/>
<br/>

## 5. Deployment & Installation Guide

### 📂 Initial Project Download
Before proceeding to browser installation, pull the portable project files onto your local machine:

1. Click the green **Code** button at the top right of this repository page.
2. Select **Download ZIP** from the dropdown menu.
3. Extract the downloaded `.zip` file archive completely to your preferred local storage directory.

---

<br/>

### 🛠️ Automated Setup (Chromium Browsers: Chrome, Brave, Edge, Opera)

The repository contains an automated orchestration pipeline designed to handle system environment setup, dependency resolution, and asset bundling automatically.

1. Open your extracted project directory and navigate into the root **`browser_exten`** folder.
2. Locate the file named **`install_and_launch.bat`**.
3. **Right-click** on the script file and select **"Run as Administrator"**.
4. The script will automatically verify dependencies, parse project files, and execute a production compile using the following routines:
   ```bash
   pnpm install
   pnpm build
