# Endfield Resolution Editor

Languages: **English** | [简体中文](README.zh.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

A Windows desktop utility built with Tauri + Vite + React for editing Endfield resolution values by updating the registry.

## Features
- Write custom width/height (positive integers only)
- Reads current resolution from registry and shows all related values
- History of changes (before/after) with one-click restore to inputs
- Built-in i18n (EN/中文/日本語/한국어) and settings panel to switch language
- Custom titlebar with window controls; resizable with minimum size

## Prerequisites
- Windows 10/11
- Node.js 18+
- Rust toolchain (stable)
- Tauri system dependencies (MSVC build tools)

## Usage
If you don't want to set up a development environment, download the latest build from the [Releases](https://github.com/hypergryph/endfield-resolution-editor/releases) page.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the desktop app:
   ```bash
   npm run tauri:dev
   ```
3. Enter width/height and click **Apply**.

> Tip: Close the game before applying changes to avoid cached values.

## Development
- Tauri + Vite dev:
  ```bash
  npm run tauri:dev
  ```
- Frontend only:
  ```bash
  npm run dev
  ```

## Release (Windows)
1. Build the app bundle:
   ```bash
   npm run tauri:build
   ```
2. Output location:
   ```text
   src-tauri/target/release/bundle
   ```

If you want custom icons, generate them first:
```bash
npx tauri icon path/to/your/icon.png
```

## Registry Keys Updated
**Width**
- `Screenmanager Resolution Width_h*`
- `Screenmanager Resolution Window Width_h*`
- `video_resolution_width_h*`

**Height**
- `Screenmanager Resolution Height_h*`
- `Screenmanager Resolution Window Height_h*`
- `video_resolution_height_h*`
