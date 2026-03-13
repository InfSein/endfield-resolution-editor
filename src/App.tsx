import { useEffect, useMemo, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { appWindow } from "@tauri-apps/api/window";
import { createTranslator, getInitialLocale, localeOptions, type Locale } from "./i18n";

const POSITIVE_INT = /^[1-9]\d*$/;
const HISTORY_KEY = "endfield-resolution-history";
const LOCALE_KEY = "endfield-resolution-locale";

type RegistryEntry = {
  name: string;
  value: number;
};

type ResolutionInfo = {
  width_entries: RegistryEntry[];
  height_entries: RegistryEntry[];
};

type HistoryEntry = {
  before: {
    width: number;
    height: number;
  };
  after: {
    width: number;
    height: number;
  };
  timestamp: string;
};

const mostCommonValue = (entries: RegistryEntry[]) => {
  if (entries.length === 0) return null;
  const counts = new Map<number, number>();
  let bestValue: number | null = null;
  let bestCount = 0;
  for (const entry of entries) {
    const next = (counts.get(entry.value) ?? 0) + 1;
    counts.set(entry.value, next);
    if (next > bestCount) {
      bestCount = next;
      bestValue = entry.value;
    }
  }
  return bestValue;
};

const normalizeHistory = (entries: unknown[]) =>
  entries
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      if ("before" in item && "after" in item && "timestamp" in item) {
        return item as HistoryEntry;
      }
      if ("width" in item && "height" in item && "timestamp" in item) {
        const legacy = item as { width: number; height: number; timestamp: string };
        return {
          before: { width: legacy.width, height: legacy.height },
          after: { width: legacy.width, height: legacy.height },
          timestamp: legacy.timestamp
        };
      }
      return null;
    })
    .filter((item): item is HistoryEntry => item !== null);

function App() {
  const [width, setWidth] = useState("1920");
  const [height, setHeight] = useState("1080");
  const [status, setStatus] = useState<"idle" | "working" | "success" | "error">("idle");
  const [resolutionInfo, setResolutionInfo] = useState<ResolutionInfo | null>(null);
  const [resolutionError, setResolutionError] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogTitle, setDialogTitle] = useState("提示");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogTone, setDialogTone] = useState<"success" | "error">("success");
  const [history, setHistory] = useState<HistoryEntry[]>(() => {
    try {
      const raw = localStorage.getItem(HISTORY_KEY);
      return raw ? normalizeHistory(JSON.parse(raw) as unknown[]) : [];
    } catch {
      return [];
    }
  });

  const [locale, setLocale] = useState<Locale>(() => getInitialLocale(LOCALE_KEY));
  const t = useMemo(() => createTranslator(locale), [locale]);

  useEffect(() => {
    localStorage.setItem(LOCALE_KEY, locale);
  }, [locale]);

  const isWidthValid = POSITIVE_INT.test(width);
  const isHeightValid = POSITIVE_INT.test(height);
  const canApply = isWidthValid && isHeightValid && status !== "working";

  const resolutionLabel = useMemo(() => {
    if (!resolutionInfo) return t("app.reading");
    const currentWidth = mostCommonValue(resolutionInfo.width_entries);
    const currentHeight = mostCommonValue(resolutionInfo.height_entries);
    if (currentWidth == null || currentHeight == null) {
      return t("app.notFound");
    }
    return `${currentWidth} × ${currentHeight}`;
  }, [resolutionInfo, t]);

  const loadResolutionInfo = async () => {
    try {
      const info = await invoke<ResolutionInfo>("get_resolution_info");
      setResolutionInfo(info);
      setResolutionError(null);
    } catch (error) {
      setResolutionError(String(error));
      setResolutionInfo(null);
    }
  };

  useEffect(() => {
    loadResolutionInfo();
  }, []);

  const canUseWindowControls =
    typeof window !== "undefined" &&
    ("__TAURI__" in window || "__TAURI_IPC__" in window);

  useEffect(() => {
    if (!canUseWindowControls) return;
    let unlisten: (() => void) | null = null;
    const init = async () => {
      try {
        setIsMaximized(await appWindow.isMaximized());
        unlisten = await appWindow.onResized(async () => {
          setIsMaximized(await appWindow.isMaximized());
        });
      } catch {
        // ignore window state errors outside desktop runtime
      }
    };
    void init();
    return () => {
      if (unlisten) unlisten();
    };
  }, [canUseWindowControls]);

  useEffect(() => {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, 50)));
  }, [history]);

  const onApply = async () => {
    if (!canApply) return;
    setStatus("working");
    try {
      const beforeWidth =
        mostCommonValue(resolutionInfo?.width_entries ?? []) ?? Number(width);
      const beforeHeight =
        mostCommonValue(resolutionInfo?.height_entries ?? []) ?? Number(height);
      const nextWidth = Number(width);
      const nextHeight = Number(height);
      await invoke("set_resolution", {
        width: nextWidth,
        height: nextHeight
      });
      if (beforeWidth !== nextWidth || beforeHeight !== nextHeight) {
        const record: HistoryEntry = {
          before: { width: beforeWidth, height: beforeHeight },
          after: { width: nextWidth, height: nextHeight },
          timestamp: new Date().toISOString()
        };
        setHistory((prev) => [record, ...prev].slice(0, 50));
      }
      setStatus("success");
      await loadResolutionInfo();
      setDialogTitle(t("dialog.success.title"));
      setDialogMessage(t("dialog.success.message"));
      setDialogTone("success");
      setDialogOpen(true);
    } catch (error) {
      setStatus("error");
      setDialogTitle(t("dialog.error.title"));
      setDialogMessage(t("dialog.error.message", { error: String(error) }));
      setDialogTone("error");
      setDialogOpen(true);
    }
  };

  const widthEntries = resolutionInfo?.width_entries ?? [];
  const heightEntries = resolutionInfo?.height_entries ?? [];

  return (
    <div className="app">
      <div
        className="titlebar"
        data-tauri-drag-region
        onPointerDown={(event) => {
          const target = event.target as HTMLElement;
          if (target.closest("button")) return;
          if (canUseWindowControls) {
            void appWindow.startDragging();
          }
        }}
      >
        <div className="titlebar-inner" data-tauri-drag-region>
          <div className="titlebar-brand" data-tauri-drag-region>
            <span className="titlebar-eyebrow">Arknights: Endfield</span>
            <span className="titlebar-title">
              {locale === "en" ? "Resolution Editor" : `Resolution Editor · ${t("app.title")}`}
            </span>
          </div>
          <div className="titlebar-controls">
            <button
              className="titlebar-button"
              type="button"
              data-tauri-drag-region="false"
              aria-label={t("titlebar.minimize")}
              onClick={() => {
                if (canUseWindowControls) {
                  void appWindow.minimize();
                }
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path d="M6 12h12" fill="none" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            </button>
            <button
              className="titlebar-button"
              type="button"
              data-tauri-drag-region="false"
              aria-label={t("titlebar.maximize")}
              onClick={() => {
                if (canUseWindowControls) {
                  void appWindow.toggleMaximize();
                }
              }}
            >
              {isMaximized ? (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect
                    x="7"
                    y="7"
                    width="10"
                    height="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                  <path
                    d="M6 9V6h11v3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <rect
                    x="6.5"
                    y="6.5"
                    width="11"
                    height="11"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                  />
                </svg>
              )}
            </button>
            <button
              className="titlebar-button danger"
              type="button"
              data-tauri-drag-region="false"
              aria-label={t("titlebar.close")}
              onClick={() => {
                if (canUseWindowControls) {
                  void appWindow.close();
                }
              }}
            >
              <svg viewBox="0 0 24 24" aria-hidden="true">
                <path
                  d="M7 7l10 10M17 7l-10 10"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
      <main className="shell">
        <div className="shell-inner">
          <section className="panel">
            <div className="panel-wrapper">
              <div className="panel-header">
                <div className="panel-title">
                  <h2>{t("app.section.config")}</h2>
                </div>
                <div className="panel-tools">
                  <div className="status-tag" data-state={resolutionError ? "error" : "idle"}>
                    <span className="status-label">{t("app.current")}</span>
                    <span className="status-value">{resolutionLabel}</span>
                    <div className="info-popover">
                      <button className="icon-button" type="button" aria-label={t("info.aria")}>
                        i
                      </button>
                      <div className="popover">
                        {resolutionError && (
                          <p className="popover-note">
                            {t("popover.readError", { error: resolutionError })}
                          </p>
                        )}
                        {!resolutionError && widthEntries.length === 0 && heightEntries.length === 0 && (
                          <p className="popover-note">{t("popover.empty")}</p>
                        )}
                        {!resolutionError && (widthEntries.length > 0 || heightEntries.length > 0) && (
                          <div className="popover-grid">
                            <div>
                              <h4>{t("popover.width")}</h4>
                              <ul>
                                {widthEntries.map((entry) => (
                                  <li key={entry.name}>
                                    <span>{entry.name}</span>
                                    <strong>{entry.value}</strong>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4>{t("popover.height")}</h4>
                              <ul>
                                {heightEntries.map((entry) => (
                                  <li key={entry.name}>
                                    <span>{entry.name}</span>
                                    <strong>{entry.value}</strong>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="history">
                    <button
                      className="icon-button"
                      type="button"
                      aria-label={t("history.aria")}
                      onClick={() => setHistoryOpen(true)}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M12 5a7 7 0 1 1-6.16 3.67M12 5V2M12 5h3M12 9v4l3 2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                  <div className="settings">
                    <button
                      className="icon-button"
                      type="button"
                      aria-label={t("settings.open")}
                      onClick={() => setSettingsOpen(true)}
                    >
                      <svg viewBox="0 0 24 24" aria-hidden="true">
                        <path
                          d="M12 8.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm8 3.2-.98-.5a7.5 7.5 0 0 0-.6-1.45l.58-1a1 1 0 0 0-.16-1.2l-1.12-1.12a1 1 0 0 0-1.2-.16l-1 .58a7.5 7.5 0 0 0-1.45-.6L12.8 4a1 1 0 0 0-.96-.8h-1.68a1 1 0 0 0-.96.8l-.38 1.05a7.5 7.5 0 0 0-1.45.6l-1-.58a1 1 0 0 0-1.2.16L4.05 6.35a1 1 0 0 0-.16 1.2l.58 1a7.5 7.5 0 0 0-.6 1.45l-1.05.5a1 1 0 0 0-.62.9v1.6c0 .38.22.72.56.88l1.11.52c.14.5.33.98.56 1.44l-.6 1a1 1 0 0 0 .16 1.2l1.12 1.12a1 1 0 0 0 1.2.16l1-.58c.46.23.94.42 1.45.6l.38 1.05c.14.34.48.56.86.56h1.68c.38 0 .72-.22.86-.56l.38-1.05c.5-.18.98-.37 1.45-.6l1 .58a1 1 0 0 0 1.2-.16l1.12-1.12a1 1 0 0 0 .16-1.2l-.58-1c.23-.46.42-.94.6-1.45l1.05-.5c.34-.16.56-.5.56-.88v-1.6c0-.38-.22-.72-.56-.88Z"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <div className="inputs">
                <label>
                  <span>{t("app.width")}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={width}
                    onChange={(event) => setWidth(event.target.value.trim())}
                    placeholder={t("app.placeholder.width")}
                  />
                  {!isWidthValid && <em>{t("app.validation.positive")}</em>}
                </label>
                <label>
                  <span>{t("app.height")}</span>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={height}
                    onChange={(event) => setHeight(event.target.value.trim())}
                    placeholder={t("app.placeholder.height")}
                  />
                  {!isHeightValid && <em>{t("app.validation.positive")}</em>}
                </label>
              </div>

              <div className="actions">
                <button className="primary" onClick={onApply} disabled={!canApply}>
                  {status === "working" ? t("app.applying") : t("app.apply")}
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {historyOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setHistoryOpen(false)}
          role="presentation"
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={t("history.title")}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{t("history.title")}</h3>
              <button
                className="icon-button"
                type="button"
                aria-label={t("dialog.close")}
                onClick={() => setHistoryOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              {history.length === 0 && <p className="modal-empty">{t("history.empty")}</p>}
              {history.length > 0 && (
                <ul className="history-list">
                  {history.map((item, index) => (
                    <li key={`${item.timestamp}-${index}`}>
                      <div className="history-meta">
                        <span>{new Date(item.timestamp).toLocaleString()}</span>
                      </div>
                      <div className="history-values">
                        <div>
                          <span className="history-label">{t("history.before")}</span>
                          <strong>
                            {item.before.width} × {item.before.height}
                          </strong>
                        </div>
                        <div>
                          <span className="history-label">{t("history.after")}</span>
                          <strong>
                            {item.after.width} × {item.after.height}
                          </strong>
                        </div>
                      </div>
                      <button
                        className="ghost"
                        type="button"
                        onClick={() => {
                          setWidth(String(item.before.width));
                          setHeight(String(item.before.height));
                          setHistoryOpen(false);
                        }}
                      >
                        {t("history.applyBefore")}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}

      {settingsOpen && (
        <div
          className="modal-backdrop"
          onClick={() => setSettingsOpen(false)}
          role="presentation"
        >
          <div
            className="modal"
            role="dialog"
            aria-modal="true"
            aria-label={t("settings.title")}
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h3>{t("settings.title")}</h3>
              <button
                className="icon-button"
                type="button"
                aria-label={t("dialog.close")}
                onClick={() => setSettingsOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="modal-body">
              <div className="setting-row">
                <div>
                  <p className="setting-label">{t("settings.language")}</p>
                </div>
                <select
                  className="setting-select"
                  value={locale}
                  onChange={(event) => setLocale(event.target.value as Locale)}
                >
                  {localeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {dialogOpen && (
        <div className="dialog-backdrop" onClick={() => setDialogOpen(false)} role="presentation">
          <div
            className="dialog"
            role="dialog"
            aria-modal="true"
            aria-label={dialogTitle}
            onClick={(event) => event.stopPropagation()}
            data-tone={dialogTone}
          >
            <div className="dialog-header">
              <div>
                <p className="dialog-eyebrow">
                  {dialogTone === "success" ? t("dialog.eyebrow.success") : t("dialog.eyebrow.error")}
                </p>
                <h3>{dialogTitle}</h3>
              </div>
              <button
                className="icon-button"
                type="button"
                aria-label={t("dialog.close")}
                onClick={() => setDialogOpen(false)}
              >
                ×
              </button>
            </div>
            <div className="dialog-body">
              <p>{dialogMessage}</p>
            </div>
            <div className="dialog-actions">
              <button className="primary" type="button" onClick={() => setDialogOpen(false)}>
                {t("dialog.ok")}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="glow" aria-hidden />
    </div>
  );
}

export default App;
