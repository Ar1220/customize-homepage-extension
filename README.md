# Ethereal Dashboard

<div align="left">
  <p><strong>Customize Homepage Extension</strong></p>
  <img src="https://img.shields.io/badge/React-18-61dafb?style=flat-square&logo=react" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-5+-3178c6?style=flat-square&logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Vite-5+-646cff?style=flat-square&logo=vite" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-3+-38bdf8?style=flat-square&logo=tailwind-css" alt="Tailwind" />
  <img src="https://img.shields.io/badge/Chrome_Extension-V3-4285f4?style=flat-square&logo=google-chrome" alt="Manifest V3" />
  <img src="https://img.shields.io/badge/Firefox_Extension-Gecko-FF7139?style=flat-square&logo=mozilla-firefox" alt="Firefox Extension" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=flat-square" alt="License" />
</div>

<br/>

### Header & Branding
A premium, client-rendered homepage engine featuring offline machine learning workflows, zero backend dependencies, and a privacy-first local architecture.

---

<br/>

# 1. Overview & Philosophy

Ethereal Dashboard is an ultra-premium, high-performance, privacy-first browser homepage engine designed to execute entirely at the client browser layer. The core system architecture operates under three strict operational zero-trust principles:

> ### 🛑 The Zero-Trust Operational Framework
> * **0 External Server Connections:** All computing overhead and asset allocations are sandboxed entirely within the local runtime context.
> * **0 Telemetry / Data Tracking:** Guarantees absolute user privacy with no underlying metrics phone-home code or analytical interception hooks.
> * **0 External API Key Dependencies:** Eliminates operational reliance on paid, rate-limited, or volatile third-party cloud engines.

Everything executes locally using client compute power, enabling fully deterministic behavior, ultra-low latency canvas rendering, and absolute user data sovereignty.

---

<br/>

# 2. Technical Capabilities & Core Features

## 💻 Spatial Layout & Canvas Engine
* **Premium Glassmorphic UI:** Features fluid, draggable widget orchestration for advanced spatial desktop personalization.
* **Fluid Animation Physics:** Utilizes Framer Motion-driven interaction mechanics for natural structural UI transitions.
* **GPU-Accelerated Styling:** Implements granular background media filters (blur, contrast, brightness) rendered via hardware-accelerated CSS pipelines to eliminate runtime repaint lag.

<br/>

## 🧠 Client-Side Machine Learning Inference
* **Local Foreground Isolation:** Implements fully offline AI subject isolation and background-removal workflows for uploaded custom imagery.
* **WASM Neural Network Pipeline:** Executes local WebAssembly neural network inference optimized to remain secure and compliant within strict Chrome Extension Manifest V3 Content Security Policy (CSP) boundaries.

<br/>

## 🐚 Spotlight Search Terminal
* **Programmable Slash Commands:** Intercepts and routes custom terminal triggers (such as `/yt`, `/gh`, and `/g`) straight from the interactive search fields.
* **Dynamic Asset Ingestion:** Features a processing string injection pipeline that dynamically renders raw local Base64 shortcut icons on active command match detection.
* **Safe Dispatch Redirection:** Implements secure query-injection handling for clean, controlled target search engine dispatches.

<br/>

## 👁️ DOM Hijacking Metadata Engine
* **Tab Layer Overrides:** Houses a local document-title override engine to bypass standard browser tab text restrictions.
* **Canvas-to-Favicon Streaming:** Handles real-time rendering of raw HTML5 canvas Base64 image streams directly into the physical browser tab favicon.
* **Zero Network Cost:** Executes visual tab identity updates instantly with zero network roundtrips or static hosting requirements.

---

<br/>

# 3. Performance Telemetry Benchmarks

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

<br/>

### Architectural Optimization Drivers:
* **Lazy WebAssembly Allocation:** Context allocations for local neural network engines remain completely dormant until explicitly invoked by user interaction.
* **Path-Agnostic Assets:** Local relative asset paths ensure efficient resource access paths across compiled storage modules, regardless of deployment environment.
* **State Tree Isolation:** Zero global-store state bloat ensures runtime memory pressure is tightly controlled with strict component re-render boundaries.

---

<br/>

# 4. Architecture & Data Persistence Details

* **Component Topology:** A clean, top-down state orchestrator manages the component tree with highly controlled re-render boundaries and clean, deterministic data flows.
* **Storage Bridge Protocol:** An asynchronous abstraction layer performs automated handshakes with `chrome.storage.local` in production environments, falling back seamlessly to immediate browser `localStorage` during local development workflows.

---

<br/>

# 5. Deployment & Installation Guide

<br/>

> ## 📂 Initial Project Download
> Before proceeding to browser installation, pull the portable project files onto your local machine:
> 
> 1. Click the green **Code** button at the top right of this repository page.
> 2. Select **Download ZIP** from the dropdown menu.
> 3. Extract the downloaded `.zip` file archive completely to your preferred local storage directory.

---

<br/>

> ## 🛠️ Automated Setup (Chromium Browsers: Chrome, Brave, Edge, Opera)
> The repository contains an automated orchestration pipeline designed to handle system environment setup, dependency resolution, and asset bundling automatically.
> 
> 1. Open your extracted project directory and navigate into the root **`browser-extention`** folder.
> 2. Locate the file named **`install_and_launch.bat`**.
> 3. **Right-click** on the script file and select **"Run as Administrator"**.
> 4. The script will automatically verify dependencies, parse project files, and execute a production compile using the following routines:
>    ```bash
>    pnpm install
>    pnpm build
>    ```
> 5. On successful completion, the script will natively inject and launch the compiled unpacked extension target directly into your chosen Chromium profile layout.

---

<br/>

> ## ⚙️ Manual Developer Mode Fallback
> If you prefer to load the compiled assets manually into a Chromium framework:
> 
> 1. Open your browser and navigate to `chrome://extensions/` in your URL bar.
> 2. Enable the **Developer mode** toggle switch in the top-right corner.
> 3. Click the **Load unpacked** button located in the top-left corner.
> 4. Open your extracted workspace folder, navigate to `browser_exten/Ui/`, and select the newly generated **`dist`** directory.

---

<br/>

> ## 🦊 Step-by-Step Firefox Installation
> 
> ⚠️ **Implementation Warning:** Automated command-line injection tools trigger external developer debugging hooks within Gecko architectures, forcing a permanent and visually disruptive *"Browser is under remote control"* warning banner across your top viewport.
> 
> For a completely clean, pristine, and warning-free installation inside Firefox, execute these manual activation steps:
> 
> 1. Open **Mozilla Firefox** normally from your desktop deployment or taskbar shortcut.
> 2. In the URL address bar at the top, type exactly <kbd>about:debugging</kbd> and press <kbd>Enter</kbd>.
> 3. On the left-hand vertical menu pane, click on **This Firefox**.
> 4. Locate the **Temporary Extensions** section block and click the **Load Temporary Add-on...** button.
> 5. An OS native file explorer window will pop up. Navigate directly into your compiled production folder within your extracted ZIP repository path:
>    ```text
>    \browser_exten\Ui\dist\
>    ```
> 6. Inside that `Ui/dist/` directory, locate and select the **`manifest.json`** file.
> 7. Open a brand new browser tab (<kbd>Ctrl</kbd> + <kbd>T</kbd>) to immediately experience your premium, edge-to-edge dashboard layout running free of developer debugging bars.

---

<br/>

<a href="https://addons.mozilla.org/en-US/firefox/addon/custom-homepage-ethereal/" target="_blank" rel="noopener noreferrer" class="group relative flex items-center justify-center gap-2 w-full h-12 border border-white/10 bg-neutral-900/60 text-gray-50 text-xs font-bold uppercase tracking-widest rounded-lg overflow-hidden transition-all duration-500 hover:border-red-500/50 hover:text-red-200 before:absolute before:w-12 before:h-12 before:content-[''] before:right-1 before:top-1 before:z-0 before:bg-red-800 before:rounded-full before:blur-lg before:duration-500 after:absolute after:z-0 after:w-20 after:h-20 after:content-[''] after:bg-red-500 after:right-8 after:top-3 after:rounded-full after:blur-lg after:duration-500 hover:before:right-12 hover:before:-bottom-8 hover:after:-right-8 hover:before:[box-shadow:_20px_20px_20px_30px_#7f1d1d] group-hover:before:duration-500 group-hover:after:duration-500"><svg height="16" width="16" viewBox="0 0 24 24" fill="currentColor" class="relative z-10 text-white group-hover:text-red-300 transition-colors duration-300"><path d="M12 .002a12 12 0 0 0-7.854 21.077c.105.09.255.03.263-.108l.128-2.25c.007-.13.097-.24.226-.27a9.423 9.423 0 0 1 2.2-.42c.133-.007.243-.107.25-.24a6.626 6.626 0 0 1 .442-2.152c.05-.12.003-.263-.107-.333a4.234 4.234 0 0 1-1.638-2.31c-.053-.173.065-.345.24-.343a5.753 5.753 0 0 0 2.115.347c.175.003.315-.13.308-.305-.052-1.228.328-2.443 1.085-3.415.105-.135.313-.095.362.068.312 1.037.99 1.92 1.91 2.484.143.087.323-.003.342-.17a8.553 8.553 0 0 1 .893-3.235c.074-.15.283-.135.337.027A4.646 4.646 0 0 0 19.34 12c.075.163-.042.347-.217.33a5.61 5.61 0 0 1-2.448-.737c-.158-.088-.348.012-.37.194-.132 1.082.083 2.18.613 3.14.08.145.283.155.378.02A6.29 6.29 0 0 1 19.863 13c.153-.083.335.025.335.2v2.183c0 .12-.073.23-.186.27a10.59 10.59 0 0 1-3.298.71c-.135.008-.24.113-.243.248-.027 1.135-.382 2.24-1.025 3.18-.075.11-.01.26.115.295a12.872 12.872 0 0 0 4.103.45c.135-.005.242.094.252.23l.113 1.545c.01.14.135.237.272.2A12.002 12.002 0 0 0 12 .002z"/></svg><span class="relative z-10 text-white group-hover:text-red-200 transition-colors duration-300">Firefox Extension</span></a>

<br/>

# 6. Screenshot

<br/>

<div align="center">
  <img src="https://github.com/user-attachments/assets/3f0b3522-cc29-4014-b3c9-a6353db30d26" width="850" alt="Ethereal Dashboard Interface Preview" />
</div>

<br/>


# 7. License

This project is licensed under the **MIT License** — an open-source, highly permissive framework that is completely free to use, modify, and distribute for personal or commercial projects.
