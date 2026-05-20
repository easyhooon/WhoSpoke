import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ExternalLink,
  Loader2,
  RefreshCw,
  Search,
  Volume2,
  VolumeX,
  X
} from "lucide-react";
import { t } from "./i18n";

type AudibleTab = chrome.tabs.Tab & {
  id: number;
};

type LoadState = "idle" | "loading" | "error";

function hasChromeTabsApi() {
  return typeof chrome !== "undefined" && Boolean(chrome.tabs?.query);
}

function isControllableTab(tab: chrome.tabs.Tab): tab is AudibleTab {
  return typeof tab.id === "number";
}

function hostFromUrl(url?: string) {
  if (!url) return t("noAddress");

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return t("internalPage");
  }
}

function sortTabs(tabs: AudibleTab[]) {
  return [...tabs].sort((a, b) => {
    const aMuted = a.mutedInfo?.muted ? 1 : 0;
    const bMuted = b.mutedInfo?.muted ? 1 : 0;

    if (aMuted !== bMuted) return aMuted - bMuted;
    if (a.windowId !== b.windowId) return a.windowId - b.windowId;
    return a.index - b.index;
  });
}

export function App() {
  const [tabs, setTabs] = useState<AudibleTab[]>([]);
  const [state, setState] = useState<LoadState>("idle");
  const [error, setError] = useState<string | null>(null);

  const audibleCount = useMemo(
    () => tabs.filter((tab) => !tab.mutedInfo?.muted).length,
    [tabs]
  );

  const mutedCount = tabs.length - audibleCount;

  const loadTabs = useCallback(async () => {
    if (!hasChromeTabsApi()) {
      setState("error");
      setError(t("openInExtensionPopup"));
      return;
    }

    try {
      setState("loading");
      setError(null);
      const audibleTabs = await chrome.tabs.query({ audible: true });
      setTabs(sortTabs(audibleTabs.filter(isControllableTab)));
      setState("idle");
    } catch {
      setState("error");
      setError(t("loadTabsError"));
    }
  }, []);

  useEffect(() => {
    void loadTabs();

    const intervalId = window.setInterval(() => {
      void loadTabs();
    }, 1500);

    return () => window.clearInterval(intervalId);
  }, [loadTabs]);

  async function activateTab(tab: AudibleTab) {
    await chrome.tabs.update(tab.id, { active: true });
    await chrome.windows.update(tab.windowId, { focused: true });
    window.close();
  }

  async function toggleMute(tab: AudibleTab) {
    await chrome.tabs.update(tab.id, {
      muted: !tab.mutedInfo?.muted
    });
    await loadTabs();
  }

  async function closeTab(tab: AudibleTab) {
    await chrome.tabs.remove(tab.id);
    await loadTabs();
  }

  async function muteAll() {
    await Promise.all(
      tabs
        .filter((tab) => !tab.mutedInfo?.muted)
        .map((tab) => chrome.tabs.update(tab.id, { muted: true }))
    );
    await loadTabs();
  }

  return (
    <main className="popup-shell">
      <header className="topbar">
        <div>
          <p className="eyebrow">WhoSpoke</p>
          <h1>{t("extensionName")}</h1>
        </div>
        <button
          aria-label={t("refresh")}
          className="icon-button"
          disabled={state === "loading"}
          title={t("refresh")}
          type="button"
          onClick={loadTabs}
        >
          {state === "loading" ? <Loader2 className="spin" /> : <RefreshCw />}
        </button>
      </header>

      <section className="summary" aria-label={t("audioTabsSummary")}>
        <div>
          <span>{audibleCount}</span>
          <p>{t("playing")}</p>
        </div>
        <div>
          <span>{mutedCount}</span>
          <p>{t("muted")}</p>
        </div>
        <button
          type="button"
          className="mute-all"
          disabled={audibleCount === 0}
          onClick={muteAll}
        >
          <VolumeX />
          {t("muteAll")}
        </button>
      </section>

      {error ? (
        <section className="empty-state" role="alert">
          <Search />
          <p>{error}</p>
        </section>
      ) : tabs.length === 0 ? (
        <section className="empty-state">
          <Search />
          <p>{t("noAudibleTabs")}</p>
        </section>
      ) : (
        <ul className="tab-list" aria-label={t("audibleTabs")}>
          {tabs.map((tab) => {
            const isMuted = Boolean(tab.mutedInfo?.muted);

            return (
              <li className={isMuted ? "tab-card muted" : "tab-card"} key={tab.id}>
                <button
                  className="tab-main"
                  type="button"
                  onClick={() => activateTab(tab)}
                >
                  <span className="favicon" aria-hidden="true">
                    {tab.favIconUrl ? (
                      <img src={tab.favIconUrl} alt="" />
                    ) : (
                      <Volume2 />
                    )}
                  </span>
                  <span className="tab-copy">
                    <strong>{tab.title || t("untitledTab")}</strong>
                    <small>{hostFromUrl(tab.url)}</small>
                  </span>
                  <ExternalLink />
                </button>

                <div className="tab-actions">
                  <button
                    aria-label={isMuted ? t("unmute") : t("muted")}
                    title={isMuted ? t("unmute") : t("muted")}
                    type="button"
                    onClick={() => toggleMute(tab)}
                  >
                    {isMuted ? <Volume2 /> : <VolumeX />}
                  </button>
                  <button
                    aria-label={t("closeTab")}
                    title={t("closeTab")}
                    type="button"
                    onClick={() => closeTab(tab)}
                  >
                    <X />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
