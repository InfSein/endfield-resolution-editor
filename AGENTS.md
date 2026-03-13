# Repository Guidelines

## Project Structure & Module Organization
- `src/`: React + TypeScript UI (`App.tsx`, `main.tsx`, `styles.css`).
- `src-tauri/`: Tauri (Rust) backend and desktop packaging.
- `src-tauri/src/main.rs`: Rust entry point and command handlers.
- `src-tauri/icons/`: App icons.
- `index.html`, `vite.config.ts`, `tsconfig*.json`: Vite/TypeScript setup.
- `src-tauri/target/`: Rust build outputs (generated; do not edit).

## Build, Test, and Development Commands
- `npm install`: install Node dependencies.
- `npm run dev`: run Vite frontend only.
- `npm run tauri:dev`: run desktop app with Tauri + Vite (primary dev flow).
- `npm run build`: TypeScript build + Vite production build.
- `npm run preview`: preview the production Vite build.
- `npm run tauri:build`: build desktop app bundle (Windows).

## Coding Style & Naming Conventions
- Indentation: 2 spaces in TS/TSX and CSS (match existing files).
- Strings: prefer double quotes in TS/TSX.
- Components: `PascalCase` (e.g., `App.tsx`).
- Files: `camelCase` or `kebab-case` for utilities; keep React entry files as-is.
- No formatter/linter is configured. Keep changes small and consistent with nearby code.

## Testing Guidelines
- No test framework is configured in this repo.
- If adding tests, prefer colocated `*.test.ts(x)` files and add a clear `npm` script.
- Minimum expectation today: manual validation of registry write flow and UI states.

## Commit & Pull Request Guidelines
- Git history is not available in this workspace, so no commit convention is enforced.
- Use short, imperative messages (e.g., `Add resolution validation`).
- PRs: describe the registry impact, include UI screenshots for visual changes, and link related issues if any.

## Security & Configuration Tips
- This app edits `HKCU\Software\Hypergryph\Endfield` registry values.
- Target platform: Windows 10/11. Ensure Tauri + Rust toolchain is installed.
- Close the game before applying changes to avoid cached values.
