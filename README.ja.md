# Endfield Resolution Editor

言語：**日本語** | [English](README.md) | [简体中文](README.zh.md) | [한국어](README.ko.md)

Tauri + Vite + React で構築された Windows デスクトップツールです。レジストリを編集して Endfield の解像度を変更します。

## 特長
- 幅/高さを任意の数値で書き込み（正の整数のみ）
- レジストリから現在の解像度を読み取り、関連項目を一覧表示
- 変更履歴（変更前/変更後）を保存し、ワンクリックで入力欄へ反映
- 多言語対応（EN/中文/日本語/한국어）＋設定パネルで切替
- カスタムタイトルバーとウィンドウ操作、最小サイズ制限付きでリサイズ可能

## 必要環境
- Windows 10/11
- Node.js 18+
- Rust ツールチェーン（stable）
- Tauri のシステム依存（MSVC ビルドツール）

## 使い方
開発環境を用意しない場合は、[Releases](https://github.com/InfSein/endfield-resolution-editor/releases) ページから最新ビルドをダウンロードしてください。

1. 依存関係をインストール：
   ```bash
   npm install
   ```
2. デスクトップアプリを起動：
   ```bash
   npm run tauri:dev
   ```
3. 幅/高さを入力し **適用** をクリック。

> ヒント：反映前にゲームを終了してください（キャッシュ回避）。

## 開発
- Tauri + Vite 開発：
  ```bash
  npm run tauri:dev
  ```
- フロントエンドのみ：
  ```bash
  npm run dev
  ```

## リリース（Windows）
1. ビルド：
   ```bash
   npm run tauri:build
   ```
2. 出力先：
   ```text
   src-tauri/target/release/bundle
   ```

カスタムアイコンが必要な場合：
```bash
npx tauri icon path/to/your/icon.png
```

## 更新されるレジストリキー
**幅**
- `Screenmanager Resolution Width_h*`
- `Screenmanager Resolution Window Width_h*`
- `video_resolution_width_h*`

**高さ**
- `Screenmanager Resolution Height_h*`
- `Screenmanager Resolution Window Height_h*`
- `video_resolution_height_h*`
