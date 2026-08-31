import { source } from '@/lib/source';
import { createFromSource } from 'fumadocs-core/search/server';

// 정적 export: 빌드 시 검색 인덱스를 JSON 파일로 출력한다.
export const revalidate = false;

export const { staticGET: GET } = createFromSource(source);
