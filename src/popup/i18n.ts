const fallbackMessages: Record<string, string> = {
  extensionName: "누가 소리를 내었는가?",
  extensionDescription:
    "소리 나는 탭을 찾아 이동, 음소거, 닫기를 빠르게 할 수 있는 Chrome 확장 프로그램입니다.",
  refresh: "새로고침",
  audioTabsSummary: "소리 탭 요약",
  playing: "재생 중",
  muted: "음소거",
  muteAll: "모두 끄기",
  openInExtensionPopup: "Chrome 확장 프로그램 팝업에서 열어주세요.",
  loadTabsError: "소리 나는 탭을 가져오지 못했습니다.",
  noAudibleTabs: "지금 소리 내는 탭이 없습니다.",
  audibleTabs: "소리 나는 탭",
  noAddress: "주소 없음",
  internalPage: "내부 페이지",
  untitledTab: "제목 없는 탭",
  unmute: "음소거 해제",
  closeTab: "탭 닫기"
};

export function t(messageName: keyof typeof fallbackMessages) {
  const message =
    typeof chrome === "undefined" ? "" : chrome.i18n?.getMessage(messageName);

  return message || fallbackMessages[messageName];
}
