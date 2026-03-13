# Endfield Resolution Editor

언어: **한국어** | [English](README.md) | [简体中文](README.zh.md) | [日本語](README.ja.md)

<p align="center">
  <img alt="Application Screenshot" src="/docs/images/main_ko.jpg" />
</p>

Tauri + Vite + React 기반의 Windows 데스크톱 도구로, 레지스트리를 수정해 Endfield 해상도를 변경합니다.

## 기능
- 너비/높이 직접 입력(양의 정수만)
- 레지스트리에서 현재 해상도를 읽고 관련 값을 표시
- 변경 이력(변경 전/변경 후) 저장 및 원클릭 입력 반영
- 다국어 지원(EN/中文/日本語/한국어) + 설정 패널에서 언어 변경
- 커스텀 타이틀바 및 창 제어, 최소 크기 제한과 함께 크기 조절 가능

## 요구 사항
- Windows 10/11
- Node.js 18+
- Rust 툴체인(stable)
- Tauri 시스템 의존성(MSVC 빌드 도구)

## 사용 방법
개발 환경을 구축하지 않을 경우 [Releases](https://github.com/InfSein/endfield-resolution-editor/releases) 페이지에서 최신 빌드를 내려받으세요.

1. 의존성 설치:
   ```bash
   npm install
   ```
2. 데스크톱 앱 실행:
   ```bash
   npm run tauri:dev
   ```
3. 너비/높이를 입력하고 **적용**을 클릭합니다.

> 팁: 캐시 문제를 피하려면 적용 전 게임을 종료하세요.

## 개발
- Tauri + Vite 개발:
  ```bash
  npm run tauri:dev
  ```
- 프론트엔드만:
  ```bash
  npm run dev
  ```

## 배포(Windows)
1. 빌드:
   ```bash
   npm run tauri:build
   ```
2. 출력 경로:
   ```text
   src-tauri/target/release/bundle
   ```

## 업데이트되는 레지스트리 키
**너비**
- `Screenmanager Resolution Width_h*`
- `Screenmanager Resolution Window Width_h*`
- `video_resolution_width_h*`

**높이**
- `Screenmanager Resolution Height_h*`
- `Screenmanager Resolution Window Height_h*`
- `video_resolution_height_h*`
