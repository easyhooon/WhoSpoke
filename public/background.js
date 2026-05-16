const BADGE_COLOR = "#f15a24";

async function refreshBadge() {
  const audibleTabs = await chrome.tabs.query({ audible: true });
  const count = audibleTabs.filter((tab) => !tab.mutedInfo?.muted).length;

  await chrome.action.setBadgeBackgroundColor({ color: BADGE_COLOR });
  await chrome.action.setBadgeText({ text: count > 0 ? String(count) : "" });
}

chrome.runtime.onInstalled.addListener(refreshBadge);
chrome.runtime.onStartup.addListener(refreshBadge);
chrome.tabs.onUpdated.addListener(refreshBadge);
chrome.tabs.onActivated.addListener(refreshBadge);
chrome.windows.onFocusChanged.addListener(refreshBadge);
