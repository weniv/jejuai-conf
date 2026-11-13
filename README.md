# JEJU AI CONFERENCE 2026

[jejuai.kr](https://jejuai.kr)의 Next.js 14 정적 사이트입니다. 행사 내용은 `src/data/data.json`, 메인 화면은 `src/app/page.tsx`에서 관리합니다.

## 로컬 실행과 검증

```sh
yarn install --frozen-lockfile
yarn dev
```

개발 서버는 `http://localhost:3000`에서 열립니다.

```sh
yarn lint
yarn build
```

빌드는 타입 검사와 정적 내보내기를 포함하며 배포 파일은 `out/`에 생성됩니다.

## 행사 정보 갱신

`src/data/data.json`에서 다음 값을 바꾸면 화면이 함께 바뀝니다.

- `registration.url`: 비어 있으면 헤더와 히어로의 버튼이 "참가 신청 준비중"으로 표시되고, 주소를 넣으면 "참가 신청하기" 링크가 됩니다.
- `program.days[].sessions`: 시간대별 세션입니다. `title`이 비어 있는 칸은 `program.comingSoon`(Coming soon)으로 표시되고, `room`·`speaker`가 비어 있으면 그 줄을 숨깁니다. 같은 시간대에 트랙을 여러 개 넣으면 나란히 표시됩니다. 세션 배열 자체를 비우면 그날의 시작·종료 시각과 `program.empty` 문구를 보여 주고, `program.notice`를 채우면 표 아래에 안내 상자가 나옵니다.

```json
{ "time": "13:00 ~ 13:50", "tracks": [{ "room": "트랙룸", "title": "세션 제목", "speaker": "소속 | 이름" }] }
```

- `partners.groups[].logos`: 비어 있으면 `partners.slots`개의 빈 자리가 점선으로 보입니다. 로고 파일은 `public/images/`에 두고 `{ "name": "기관명", "src": "/images/파일.svg", "url": "https://..." }` 형태로 넣습니다(`url`은 생략 가능). 로고는 남색 배경에 맞춰 흰색 한 가지로 표시됩니다.

`eventTime`과 위 정보로 구글 검색용 행사 정보(schema.org Event)를 페이지에 함께 싣습니다. 배포 후 [리치 결과 테스트](https://search.google.com/test/rich-results)에 `https://jejuai.kr`을 넣어 확인할 수 있습니다.

찾아오시는 길의 지도는 빌드 환경변수 `NEXT_PUBLIC_KAKAO_APP_JS_KEY`(GitHub Secrets)가 유효하면 카카오맵을, 없거나 막혀 있으면 키가 필요 없는 구글 지도 임베드를 보여 줍니다. 카카오맵을 쓰려면 Kakao Developers에서 JavaScript 키를 발급하고 `jejuai.kr`을 사이트 도메인으로 등록해야 합니다.

## 애니메이션

`src/components/stage/engine.ts`에서 키비주얼의 제주 등고선 그래픽(`public/images/kv-terrain.svg`, 피그마 원본 벡터)과 Agent 커서를 그립니다. 데스크톱은 10개, 모바일은 6개 커서를 사용합니다. 아직 적히지 않은 내용이 화면에 들어올 때만 쓸 내용만큼의 커서가 정상에서 나와 글자를 쓰고 곧장 정상으로 돌아가 쉬며, 한 번 적힌 내용은 스크롤로 벗어났다 돌아와도 다시 쓰지 않습니다. 등고선은 세로로 가늘게 나눠 그려 위아래로 천천히 일렁이고, 스크롤하면 분화구에서 잔잔한 물결이 한 번씩 퍼집니다. 민트 "AI" 글자는 원본 SVG의 마스크를 그대로 씁니다. 백그라운드 탭에서는 렌더링을 멈춥니다.

모션 감소 설정에서는 지형만 정적으로 표시합니다. Agent 끄기는 화면 하단 프롬프트의 ×로, 오프닝 다시 보기는 푸터 링크로 사용할 수 있습니다. Agent 이름표는 글자를 쓰는 동안에만 표시합니다.

## 브랜드 이미지

헤더는 `JEJU AI / CONFERENCE 2026` 텍스트 워드마크를 사용합니다. 작은 아이콘에는 `AI` 텍스트를 사용합니다. SNS 공유 이미지와 아이콘 설정은 `src/app/layout.tsx`에서 관리합니다.

SNS 공유 이미지(`public/images/og-2026.jpg`, 1200×630)는 피그마 `썸네일 B · 큰 글자` 프레임(790×416)을 2배로 내보내 1200×630으로 맞춘 것입니다. 바꿀 때는 파일 이름을 새로 지어 `layout.tsx`와 `page.tsx`의 경로를 함께 바꾸면 SNS 미리보기 캐시를 피할 수 있습니다.

아이콘은 프로젝트의 Pretendard 글꼴로 다시 생성할 수 있습니다.

```sh
python -m pip install pillow fonttools
python scripts/generate-brand-assets.py
```

이미지는 저장소에 포함되어 있어 일반 빌드와 배포에는 Python이 필요하지 않습니다. 디자인 시안과 이미지 모델 생성 프롬프트는 각각 `design/explorations/`, `scripts/prompts/`에 보관합니다. 시안 HTML은 로컬에서 직접 열 수 있으며 운영 사이트에는 포함되지 않습니다.

## 운영 배포

`main`에 푸시하면 `.github/workflows/nextjs.yml`이 Yarn 빌드를 실행하고 `out/`을 `gh-pages` 브랜치에 배포합니다. GitHub Pages의 운영 도메인은 `jejuai.kr`입니다.

배포 후 확인 항목:

- 데스크톱·모바일의 워드마크와 메뉴 배치, 좁은 화면의 펼침 메뉴
- 스크롤로 벗어났다 돌아왔을 때 이미 적힌 내용이 유지되는지
- FAQ, Agent 끄기, 오프닝 다시 보기
- 모션 감소 설정의 본문 표시
- Open Graph 이미지와 SVG·ICO·Apple 아이콘
