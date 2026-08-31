# docs

팀을 위한 문서 저장소입니다. [Fumadocs](https://fumadocs.dev)를 기반으로 구축된 정적 문서 사이트이며,
main에 푸시되면 GitHub Pages로 자동 배포됩니다.

- **문서 사이트**: https://cyphers-good.github.io/docs/
- **배포 방식**: main 푸시 = 자동 빌드·배포 (GitHub Actions)

## 문서 작성 방법

### 1. 파일 생성

`content/docs/` 디렉터리에 `.mdx` 파일을 만듭니다. 확장자는 `.mdx`이지만
**일반 마크다운 문법이 전부 그대로 동작**하므로, React를 몰라도 작성할 수 있습니다.

```mdx
---
title: 문서 제목        ← 필수
description: 한 줄 설명  ← 필수
---

## 첫 번째 섹션

일반 마크다운 문법 그대로 작성하면 됩니다.
```

### 2. 사이드바 등록

`content/docs/meta.json`의 `pages` 배열에 파일 이름(확장자 제외)을 원하는 순서로 추가합니다.

```json
{
  "title": "문서",
  "pages": ["index", "새문서이름"]
}
```

문서가 많아지면 `content/docs/backend/api-guide.mdx`처럼 하위 폴더로 묶을 수 있습니다.
이 경우 주소는 `/backend/api-guide`가 되고, 폴더 안에 별도의 `meta.json`을 두어 순서를 관리합니다.

### 3. 인터랙티브 컴포넌트 (선택)

등록된 컴포넌트는 import 없이 마크다운 사이에 태그로 넣으면 그 자리에 렌더링됩니다.

| 태그 | 용도 |
| --- | --- |
| `<Tabs items={['A', 'B']}>` + `<Tab value="A">` | 상황에 따라 다른 절차를 보여줄 때 |
| `<Steps>` + `<Step>` | 순서대로 따라하는 절차 |
| `<GitFlowDiagram flow="release" />` | 단계별 애니메이션 도식 (예시) |

새로운 주제의 애니메이션 도식이 필요하면 `components/`에 장면 컴포넌트를 추가하고
`mdx-components.tsx`에 등록하는 개발 작업이 한 번 필요합니다.
방법은 `.claude/skills/animated-diagram/SKILL.md`에 정리되어 있습니다.

### 4. 로컬 미리보기

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # 배포 전 빌드 확인 (out/ 생성)
```

## 기여 방법

1. `docs/<주제>` 형식으로 브랜치를 만듭니다. (예: `docs/api-guide`)
2. 문서를 작성하고 `npm run build`가 통과하는지 확인합니다.
3. PR을 올려 main으로 merge합니다. **merge되는 순간 자동으로 배포됩니다.**

오탈자 수정처럼 작은 변경은 GitHub 웹 화면에서 파일을 직접 수정하고 커밋해도 동일하게 동작합니다.
main 푸시가 곧 배포이므로, 빌드가 깨진 상태로 main에 올리지 않도록 주의해주세요.
