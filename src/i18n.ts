export type Locale = "zh" | "en" | "ja" | "ko";

type Dictionary = Record<string, string>;

type Dictionaries = Record<Locale, Dictionary>;

const dictionaries: Dictionaries = {
  zh: {
    "settings.title": "设置",
    "settings.language": "语言",
    "settings.open": "打开设置",
    "app.title": "分辨率编辑器",
    "app.section.config": "配置",
    "app.current": "当前：",
    "app.reading": "未读取分辨率",
    "app.notFound": "未找到分辨率",
    "app.width": "宽度",
    "app.height": "高度",
    "app.widthPx": "宽度",
    "app.heightPx": "高度",
    "app.placeholder.width": "例如 1920",
    "app.placeholder.height": "例如 1080",
    "app.validation.positive": "请输入正整数",
    "app.apply": "确认",
    "app.applying": "执行中...",
    "popover.readError": "读取失败：{error}",
    "popover.empty": "未找到关联的注册表项",
    "popover.width": "宽度",
    "popover.height": "高度",
    "history.title": "历史记录",
    "history.empty": "暂无记录",
    "history.before": "调整前",
    "history.after": "调整后",
    "history.applyBefore": "应用调整前",
    "titlebar.minimize": "最小化",
    "titlebar.maximize": "最大化",
    "titlebar.close": "关闭",
    "titlebar.aria": "窗口标题栏",
    "info.aria": "查看当前注册表值",
    "history.aria": "查看历史记录",
    "dialog.close": "关闭提示",
    "dialog.ok": "好的",
    "dialog.eyebrow.success": "完成",
    "dialog.eyebrow.error": "错误",
    "dialog.success.title": "写入成功",
    "dialog.success.message": "已更新注册表，重启游戏后生效。",
    "dialog.error.title": "写入失败",
    "dialog.error.message": "写入失败：{error}"
  },
  en: {
    "settings.title": "Settings",
    "settings.language": "Language",
    "settings.open": "Open settings",
    "app.title": "Resolution Editor",
    "app.section.config": "Settings",
    "app.current": "Current:",
    "app.reading": "Resolution unavailable",
    "app.notFound": "Resolution not found",
    "app.width": "Width",
    "app.height": "Height",
    "app.widthPx": "Width",
    "app.heightPx": "Height",
    "app.placeholder.width": "e.g. 1920",
    "app.placeholder.height": "e.g. 1080",
    "app.validation.positive": "Enter a positive integer",
    "app.apply": "Apply",
    "app.applying": "Applying...",
    "popover.readError": "Read failed: {error}",
    "popover.empty": "No related registry values found",
    "popover.width": "Width",
    "popover.height": "Height",
    "history.title": "History",
    "history.empty": "No records",
    "history.before": "Before",
    "history.after": "After",
    "history.applyBefore": "Apply previous",
    "titlebar.minimize": "Minimize",
    "titlebar.maximize": "Maximize",
    "titlebar.close": "Close",
    "titlebar.aria": "Window title bar",
    "info.aria": "View registry values",
    "history.aria": "View history",
    "dialog.close": "Close dialog",
    "dialog.ok": "OK",
    "dialog.eyebrow.success": "Done",
    "dialog.eyebrow.error": "Error",
    "dialog.success.title": "Write successful",
    "dialog.success.message": "Registry updated. Restart the game to apply.",
    "dialog.error.title": "Write failed",
    "dialog.error.message": "Write failed: {error}"
  },
  ja: {
    "settings.title": "設定",
    "settings.language": "言語",
    "settings.open": "設定を開く",
    "app.title": "解像度エディター",
    "app.section.config": "設定",
    "app.current": "現在：",
    "app.reading": "解像度を取得できません",
    "app.notFound": "解像度が見つかりません",
    "app.width": "幅",
    "app.height": "高さ",
    "app.widthPx": "幅",
    "app.heightPx": "高さ",
    "app.placeholder.width": "例：1920",
    "app.placeholder.height": "例：1080",
    "app.validation.positive": "正の整数を入力してください",
    "app.apply": "適用",
    "app.applying": "適用中...",
    "popover.readError": "読み取り失敗：{error}",
    "popover.empty": "関連するレジストリ項目が見つかりません",
    "popover.width": "幅",
    "popover.height": "高さ",
    "history.title": "履歴",
    "history.empty": "履歴はありません",
    "history.before": "変更前",
    "history.after": "変更後",
    "history.applyBefore": "変更前を適用",
    "titlebar.minimize": "最小化",
    "titlebar.maximize": "最大化",
    "titlebar.close": "閉じる",
    "titlebar.aria": "ウィンドウタイトルバー",
    "info.aria": "レジストリ値を表示",
    "history.aria": "履歴を表示",
    "dialog.close": "ダイアログを閉じる",
    "dialog.ok": "OK",
    "dialog.eyebrow.success": "完了",
    "dialog.eyebrow.error": "エラー",
    "dialog.success.title": "書き込み成功",
    "dialog.success.message": "レジストリを更新しました。ゲームを再起動してください。",
    "dialog.error.title": "書き込み失敗",
    "dialog.error.message": "書き込み失敗：{error}"
  },
  ko: {
    "settings.title": "설정",
    "settings.language": "언어",
    "settings.open": "설정 열기",
    "app.title": "해상도 편집기",
    "app.section.config": "설정",
    "app.current": "현재:",
    "app.reading": "해상도를 불러올 수 없습니다",
    "app.notFound": "해상도를 찾을 수 없습니다",
    "app.width": "너비",
    "app.height": "높이",
    "app.widthPx": "너비",
    "app.heightPx": "높이",
    "app.placeholder.width": "예: 1920",
    "app.placeholder.height": "예: 1080",
    "app.validation.positive": "양의 정수를 입력하세요",
    "app.apply": "적용",
    "app.applying": "적용 중...",
    "popover.readError": "읽기 실패: {error}",
    "popover.empty": "관련 레지스트리 항목이 없습니다",
    "popover.width": "너비",
    "popover.height": "높이",
    "history.title": "기록",
    "history.empty": "기록 없음",
    "history.before": "변경 전",
    "history.after": "변경 후",
    "history.applyBefore": "이전 값 적용",
    "titlebar.minimize": "최소화",
    "titlebar.maximize": "최대화",
    "titlebar.close": "닫기",
    "titlebar.aria": "창 제목 표시줄",
    "info.aria": "레지스트리 값 보기",
    "history.aria": "기록 보기",
    "dialog.close": "대화상자 닫기",
    "dialog.ok": "확인",
    "dialog.eyebrow.success": "완료",
    "dialog.eyebrow.error": "오류",
    "dialog.success.title": "쓰기 성공",
    "dialog.success.message": "레지스트리가 업데이트되었습니다. 게임을 재시작하세요.",
    "dialog.error.title": "쓰기 실패",
    "dialog.error.message": "쓰기 실패: {error}"
  }
};

export const localeOptions: { value: Locale; label: string }[] = [
  { value: "zh", label: "简体中文" },
  { value: "en", label: "English" },
  { value: "ja", label: "日本語" },
  { value: "ko", label: "한국어" }
];

export const getSystemLocale = (): Locale => {
  if (typeof navigator === "undefined") return "zh";
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("zh")) return "zh";
  if (lang.startsWith("ja")) return "ja";
  if (lang.startsWith("ko")) return "ko";
  if (lang.startsWith("en")) return "en";
  return "zh";
};

export const getInitialLocale = (storageKey: string): Locale => {
  if (typeof localStorage === "undefined") return getSystemLocale();
  const stored = localStorage.getItem(storageKey) as Locale | null;
  if (stored && stored in dictionaries) return stored;
  return getSystemLocale();
};

export const createTranslator = (locale: Locale) => {
  const dict = dictionaries[locale] ?? dictionaries.zh;
  return (key: string, params?: Record<string, string | number>) => {
    const template = dict[key] ?? dictionaries.zh[key] ?? key;
    if (!params) return template;
    return Object.keys(params).reduce((result, paramKey) => {
      return result.replace(new RegExp(`\\{${paramKey}\\}`, "g"), String(params[paramKey]));
    }, template);
  };
};
