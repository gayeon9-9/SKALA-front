# 성가연의 유니버스 · 실시간 날씨

## 프로젝트에 넣는 위치

압축을 푼 뒤 `html`, `css`, `script` 폴더를 `SKALA-front` 프로젝트의 같은 이름 폴더에 넣습니다.

```text
SKALA-front/
├── html/
│   └── index.html
├── css/
│   └── style.css
└── script/
    ├── realtimeInfo.js
    ├── weatherAPI.js
    ├── upDown.js
    ├── grade.js
    └── bag.js
```

기존 파일을 바꾸기 전에는 파일 이름 뒤에 `Old`를 붙이는 방식 등으로 백업해 두는 것을 권장합니다.

## 실행 방법

ES Module의 `import/export`와 실시간 API 호출을 사용하므로 HTML 파일을 더블클릭하지 말고 VS Code의 **Live Server**로 실행합니다.

1. VS Code에서 `SKALA-front` 폴더를 엽니다.
2. `html/index.html`을 엽니다.
3. 마우스 오른쪽 버튼을 눌러 **Open with Live Server**를 선택합니다.
4. 오른쪽의 도시 선택 메뉴에서 도시를 변경합니다.

## 확인할 실행 결과

- 도시를 바꾸면 도시 이름과 위도·경도가 즉시 표시됩니다.
- 날씨를 받아오는 동안 `로딩 중... ⏳`이 표시됩니다.
- 호출이 끝나면 현재 온도와 습도가 함께 표시됩니다.
- 인터넷 또는 API 연결에 실패하면 오류 안내가 표시됩니다.

## 파일 역할

- `html/index.html`: 화면 구조, 도시 선택 메뉴, 날씨 결과 영역
- `script/weatherAPI.js`: Open-Meteo API 호출과 데이터 반환
- `script/realtimeInfo.js`: 변경 이벤트와 화면 출력
- `css/style.css`: 유니버스 페이지 전체 디자인과 반응형 레이아웃
