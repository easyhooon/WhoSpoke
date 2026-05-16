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
  if (!url) return "주소 없음";

  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "내부 페이지";
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
      setError("Chrome 확장 프로그램 팝업에서 열어주세요.");
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
      setError("소리 나는 탭을 가져오지 못했습니다.");
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
          <h1>누가 소리를 내었는가?</h1>
        </div>
        <button
          aria-label="새로고침"
          className="icon-button"
          disabled={state === "loading"}
          title="새로고침"
          type="button"
          onClick={loadTabs}
        >
          {state === "loading" ? <Loader2 className="spin" /> : <RefreshCw />}
        </button>
      </header>

      <section className="summary" aria-label="소리 탭 요약">
        <div>
          <span>{audibleCount}</span>
          <p>재생 중</p>
        </div>
        <div>
          <span>{mutedCount}</span>
          <p>음소거</p>
        </div>
        <button
          type="button"
          className="mute-all"
          disabled={audibleCount === 0}
          onClick={muteAll}
        >
          <VolumeX />
          모두 끄기
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
          <p>지금 소리 내는 탭이 없습니다.</p>
        </section>
      ) : (
        <ul className="tab-list" aria-label="소리 나는 탭">
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
                    <strong>{tab.title || "제목 없는 탭"}</strong>
                    <small>{hostFromUrl(tab.url)}</small>
                  </span>
                  <ExternalLink />
                </button>

                <div className="tab-actions">
                  <button
                    aria-label={isMuted ? "음소거 해제" : "음소거"}
                    title={isMuted ? "음소거 해제" : "음소거"}
                    type="button"
                    onClick={() => toggleMute(tab)}
                  >
                    {isMuted ? <Volume2 /> : <VolumeX />}
                  </button>
                  <button
                    aria-label="탭 닫기"
                    title="탭 닫기"
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
