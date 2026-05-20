# 누가 소리를 내었는가?

<img width="800" height="452" alt="누가 기침소리를 내었는가" src="https://github.com/user-attachments/assets/fcad3fd4-08d7-46d6-8921-f3faf165f31b" />

수십 개의 Chrome 탭 중 어떤 탭에서 소리가 나는지 바로 확인하고, 해당 탭으로 이동하거나 음소거하거나 닫는 Chrome Extension입니다.

## 기술 선택

- Chrome Extension Manifest V3
- Chrome Extension i18n API
- Vite
- React
- TypeScript
- lucide-react

Android 개발자 관점에서 보면 `public/background.js`는 백그라운드에서 배지 카운트를 관리하는 얇은 서비스 워커이고, `src/popup/App.tsx`는 툴바 아이콘을 눌렀을 때 열리는 작은 화면입니다.

## 현재 기능

<img width="640" height="400" alt="image" src="https://github.com/user-attachments/assets/04c6b9b2-1ad8-4d00-9c44-5001d3ec290f" />

- 소리 나는 탭 목록 표시
- 탭 제목, 도메인, 파비콘 표시
- 클릭 시 해당 탭과 창으로 이동
- 탭 단위 음소거 토글
- 탭 닫기
- 현재 소리 나는 탭 전체 음소거
- 툴바 배지에 재생 중인 탭 개수 표시

## 참고한 공식 문서

Chrome Extensions의 `chrome.tabs` API는 최근 몇 초 동안 소리를 낸 탭을 `Tab.audible`로 알려주고, `chrome.tabs.update(tabId, { muted })`로 탭 단위 음소거를 지원합니다.

- [Chrome Tabs API](https://developer.chrome.com/docs/extensions/reference/api/tabs)
- [Manifest V3 개요](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)

---

# Who made that sound?

WhoSpoke is a Chrome extension that helps you quickly find which tab is currently playing audio. It lists only the noisy tabs, then lets you switch to, mute, unmute, or close them from a small toolbar popup.

Chrome already shows a speaker icon on tabs that are making sound. That works well when you only have a few tabs open. It becomes much less convenient when you work with dozens of tabs, multiple Chrome windows, or an external monitor setup.

WhoSpoke was built for those moments when you can hear something playing somewhere, but do not want to scan every tab bar by hand.

## Tech Stack

- Chrome Extension Manifest V3
- Chrome Extension i18n API
- Vite
- React
- TypeScript
- lucide-react

`public/background.js` is a small service worker that keeps the toolbar badge count up to date. `src/popup/App.tsx` renders the popup UI shown when the toolbar icon is clicked.

## Features

- Lists tabs that are currently playing audio
- Shows each tab's title, domain, and favicon
- Switches to the selected tab and focuses its window
- Mutes or unmutes individual tabs
- Closes noisy tabs
- Mutes all currently playing tabs at once
- Shows the number of playing tabs in the toolbar badge
- Supports English and Korean UI strings

## Official References

The extension uses the Chrome `tabs` API. `Tab.audible` identifies tabs that have recently played audio, and `chrome.tabs.update(tabId, { muted })` controls tab-level mute state.

- [Chrome Tabs API](https://developer.chrome.com/docs/extensions/reference/api/tabs)
- [Manifest V3 overview](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)
- [Chrome i18n API](https://developer.chrome.com/docs/extensions/reference/api/i18n)
