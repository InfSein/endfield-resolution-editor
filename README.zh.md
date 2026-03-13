# Endfield Resolution Editor

语言：**简体中文** | [English](README.md) | [日本語](README.ja.md) | [한국어](README.ko.md)

<p align="center">
  <img alt="Application Screenshot" src="/docs/images/main_zh.jpg" />
</p>

一个基于 Tauri + Vite + React 的 Windows 桌面工具，用于通过修改注册表调整终末地分辨率。

## 功能
- 写入自定义宽高（仅支持正整数）
- 从注册表读取当前分辨率，并展示关联项的当前值
- 变更历史（调整前/调整后），支持一键回填到输入框
- 内置多语言（EN/中文/日本語/한국어）与设置面板切换语言
- 自定义标题栏与窗口控制；支持调整窗口大小并限制最小尺寸

## 环境要求
- Windows 10/11
- Node.js 18+
- Rust 工具链（stable）
- Tauri 系统依赖（MSVC 构建工具）

## 使用方式
如果不想搭建开发环境，请直接前往 [Releases](https://github.com/InfSein/endfield-resolution-editor/releases) 页面下载最新构建。

1. 安装依赖：
   ```bash
   npm install
   ```
2. 启动桌面应用：
   ```bash
   npm run tauri:dev
   ```
3. 输入宽高并点击 **确认**。

> 提示：写入前请关闭游戏，避免缓存导致不生效。

## 开发
- Tauri + Vite 开发：
  ```bash
  npm run tauri:dev
  ```
- 仅前端：
  ```bash
  npm run dev
  ```

## 发布（Windows）
1. 构建应用：
   ```bash
   npm run tauri:build
   ```
2. 输出目录：
   ```text
   src-tauri/target/release/bundle
   ```

## 更新的注册表项
**宽度**
- `Screenmanager Resolution Width_h*`
- `Screenmanager Resolution Window Width_h*`
- `video_resolution_width_h*`

**高度**
- `Screenmanager Resolution Height_h*`
- `Screenmanager Resolution Window Height_h*`
- `video_resolution_height_h*`
