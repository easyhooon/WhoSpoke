# 누가 소리를 내었는가?

![누가 소리를 내었는가?](docs/assets/who-spoke-meme.svg)

수십 개의 Chrome 탭 중 어디서 소리가 나는지 바로 찾고, 해당 탭으로 이동하거나 음소거하거나 닫는 Chrome Extension입니다.

## 가능 여부

가능합니다. Chrome Extensions의 `chrome.tabs` API는 최근 몇 초 동안 소리를 낸 탭을 `Tab.audible`로 알려주고, `chrome.tabs.update(tabId, { muted })`로 탭 단위 음소거를 지원합니다.

참고한 공식 문서:

- [Chrome Tabs API](https://developer.chrome.com/docs/extensions/reference/api/tabs)
- [Manifest V3 개요](https://developer.chrome.com/docs/extensions/develop/migrate/what-is-mv3)

## 유사 서비스

이미 비슷한 확장은 있습니다. 대표적으로 Chrome Web Store의 [Tab Muter](https://chromewebstore.google.com/detail/tab-muter/bnclejfcblondkjliiblkojdeloomadd)는 탭 단위 음소거를 되살리는 확장이고, [Smart Mute](https://smartmute.io/)는 하나의 탭만 소리 나도록 제어하는 쪽에 가깝습니다. 최근에는 “Audio Tab Finder”처럼 소리 나는 탭을 찾는 소형 확장도 보입니다.

이 프로젝트의 차별점은 한국어 밈 기반 브랜딩, 초간단 목록 UI, “이동/음소거/닫기/전체 음소거”를 한 화면에서 끝내는 방향입니다.

## 기술 선택

- Chrome Extension Manifest V3
- Vite
- React
- TypeScript
- lucide-react

Android 개발자 관점에서 보면 `public/background.js`는 백그라운드에서 배지 카운트를 관리하는 얇은 서비스 워커이고, `src/popup/App.tsx`는 툴바 아이콘을 눌렀을 때 열리는 작은 화면입니다.

## 개발

```bash
npm install
npm run build
```

빌드 결과물은 `dist/`에 생성됩니다.

## 로컬 설치

1. `npm run build`를 실행합니다.
2. Chrome에서 `chrome://extensions`를 엽니다.
3. 우측 상단의 개발자 모드를 켭니다.
4. `압축해제된 확장 프로그램을 로드`를 누릅니다.
5. 이 프로젝트의 `dist/` 폴더를 선택합니다.

## 현재 기능

- 소리 나는 탭 목록 표시
- 탭 제목, 도메인, 파비콘 표시
- 클릭 시 해당 탭과 창으로 이동
- 탭 단위 음소거 토글
- 탭 닫기
- 현재 소리 나는 탭 전체 음소거
- 툴바 배지에 재생 중인 탭 개수 표시

## 배포 전 체크리스트

- Chrome Web Store용 128x128 PNG 아이콘 제작
- 스크린샷 1~3장 제작
- 개인정보 처리방침 작성: 외부 서버 전송 없음, 데이터 수집 없음
- Store 설명문 영문/국문 작성
- README의 밈 배너를 최종 이미지로 교체하거나 현재 오리지널 배너를 유지

## LinkedIn 초안

탭을 수십 개씩 열어두고 일하다가 갑자기 어디선가 소리가 나기 시작한 적 있나요?

저도 매번 Chrome 탭 사이를 헤매다가 결국 작은 확장 프로그램을 만들기 시작했습니다.

이름은 “누가 소리를 내었는가?”입니다.

소리 나는 탭을 바로 찾아서 이동하고, 음소거하고, 필요하면 닫을 수 있게 만드는 아주 작은 도구입니다. Android 개발자인 제가 Chrome Extension을 처음부터 배워가며 만든 프로젝트라, Manifest V3와 React 기반 확장 개발 과정도 함께 정리해보려고 합니다.

곧 Chrome Web Store 링크와 함께 공유하겠습니다.

#ChromeExtension #React #TypeScript #SideProject #Productivity
