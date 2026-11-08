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

## 애니메이션

`src/components/stage/engine.ts`에서 제주 지형과 Agent 커서를 그립니다. 데스크톱은 24개, 모바일은 14개 커서를 사용하며, 콘텐츠 진입·스크롤·대기 상태에 맞춰 분화와 탐색을 반복합니다. 백그라운드 탭에서는 렌더링을 멈춥니다.

모션 감소 설정에서는 지형만 정적으로 표시합니다. 오프닝 다시 보기와 Agent 끄기 기능은 화면 하단에서 사용할 수 있습니다.

## 브랜드 이미지

헤더는 `JEJU AI / CONFERENCE 2026` 텍스트 워드마크를 사용합니다. 작은 아이콘에는 `AI` 텍스트를 사용합니다. SNS 공유 이미지와 아이콘 설정은 `src/app/layout.tsx`에서 관리합니다.

제주 지형과 프로젝트의 Pretendard 글꼴로 운영 이미지를 다시 생성할 수 있습니다.

```sh
python -m pip install pillow fonttools
python scripts/generate-brand-assets.py
```

이미지는 저장소에 포함되어 있어 일반 빌드와 배포에는 Python이 필요하지 않습니다. 디자인 시안과 이미지 모델 생성 프롬프트는 각각 `design/explorations/`, `scripts/prompts/`에 보관합니다. 시안 HTML은 로컬에서 직접 열 수 있으며 운영 사이트에는 포함되지 않습니다.

## 운영 배포

`main`에 푸시하면 `.github/workflows/nextjs.yml`이 Yarn 빌드를 실행하고 `out/`을 `gh-pages` 브랜치에 배포합니다. GitHub Pages의 운영 도메인은 `jejuai.kr`입니다.

배포 후 확인 항목:

- 데스크톱·모바일의 워드마크와 메뉴 배치
- 스크롤을 멈춘 상태의 반복 분화와 Agent 커서
- FAQ, Agent 끄기, 오프닝 다시 보기
- 모션 감소 설정의 본문 표시
- Open Graph 이미지와 SVG·ICO·Apple 아이콘
