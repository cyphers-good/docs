# docs

팀을 위한 문서 저장소입니다. [Fumadocs](https://fumadocs.dev)를 기반으로 구축된 정적 문서 사이트이며,
GitHub Pages로 배포됩니다.

- 배포 주소: https://cyphers-good.github.io/docs/
- 문서 추가 위치: `content/docs/*.mdx`

## 로컬 개발

```bash
npm install
npm run dev        # http://localhost:3000 에서 확인할 수 있습니다
```

## 정적 빌드

```bash
npm run build      # out/ 디렉터리에 정적 HTML이 생성됩니다
```

## 배포

main 브랜치에 푸시하면 GitHub Actions가 자동으로 GitHub Pages에 배포합니다.
최초 1회에 한해, 저장소의 Settings → Pages → Source 항목을 **GitHub Actions**로 설정해야 합니다.
