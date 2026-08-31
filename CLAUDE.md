# CLAUDE.md

## 프로젝트 개요

Fumadocs(Next.js) 기반 정적 문서 사이트. main에 푸시되면 GitHub Actions가
GitHub Pages(`https://cyphers-good.github.io/docs/`)로 자동 배포한다.

## 명령어

```bash
npm install        # 의존성 설치
npm run dev        # 로컬 개발 서버 (http://localhost:3000)
npm run build      # 정적 빌드 (out/) — 변경 후 반드시 빌드가 통과하는지 확인할 것
```

## 문서 유지 규칙

- 문서는 `content/docs/*.mdx` 에 작성한다. frontmatter에 `title`, `description` 필수.
- 새 문서를 추가하면 `content/docs/meta.json` 의 `pages` 배열에 등록한다.
- 문서는 한국어로 작성한다.
- 사이트 구조(app/, lib/)는 문서 작성 시 건드릴 필요 없다.

## 한국어 문체 규칙 (fluent-korean)

- 이 프로젝트에는 [fluent-korean](https://github.com/snflkd/fluent-korean) 출력 스타일이
  `.claude/output-styles/fluent-korean.md` 에 배치되어 있고, `.claude/settings.json` 의
  `outputStyle` 값으로 기본 적용되어 있다.
- 문서 본문, 사용자에게 전달하는 답변 등 모든 한국어 산출물은 이 지침을 준수해서 작성한다.
  핵심: 문장 성분과 조사·어미를 생략하지 않고, 서술어와 종결어미로 완결된 문장을 쓰며,
  비유적 어휘로 일반 어휘를 대체하지 않고, 엠대시(—)를 사용하지 않는다.
- 세부 조항은 반드시 `.claude/output-styles/fluent-korean.md` 원문을 직접 읽고 적용한다.
  (원문 지침에 따라, 이 요약만 보고 작업하지 않는다.)

## 브랜치 규칙

- **`claude/` 접두사 브랜치를 사용하지 않는다.** 세션이 `claude/*` 브랜치를 만들었다면
  `docs/<주제>` 형식의 브랜치로 옮겨서 푸시한다. (예: `docs/api-guide`)
- 작업 브랜치는 `docs/<주제>` 형식으로 만들고 main으로 머지한다.
- main 푸시 = 배포이므로, 빌드가 깨진 상태로 main에 올리지 않는다.

## 커밋 규칙

- 커밋 메시지는 한국어로 간결하게 작성한다.
- 커밋 메시지·PR 본문·author 어디에도 Claude 흔적(Claude/AI 관련 문구, Co-Authored-By,
  Generated with, 세션 링크, `Claude <noreply@anthropic.com>` 명의)을 남기지 않는다.
- Claude 명의의 커밋이 발견되면 푸시 전에 재작성한다.
