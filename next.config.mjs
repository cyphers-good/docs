import { createMDX } from 'fumadocs-mdx/next';

const withMDX = createMDX();

// GitHub Pages는 https://<org>.github.io/<repo>/ 하위 경로로 서빙되므로
// 배포 빌드에서만 basePath를 주입한다. (워크플로에서 NEXT_PUBLIC_BASE_PATH=/docs 설정)
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? '';

/** @type {import('next').NextConfig} */
const config = {
  output: 'export',
  basePath,
  trailingSlash: true,
  images: {
    // 정적 export에서는 Next 이미지 최적화 서버를 쓸 수 없다.
    unoptimized: true,
  },
  reactStrictMode: true,
};

export default withMDX(config);
