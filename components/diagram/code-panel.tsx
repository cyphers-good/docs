'use client';

import { cn } from '@/lib/utils';

/**
 * 단계별 코드 하이라이트 패널: 렌더 성능 개선처럼 코드 실행 흐름을 설명할 때,
 * SVG 장면 옆이나 아래에 두고 현재 단계에서 실행되는 줄을 강조한다.
 *
 * 사용 방법: 단계 번호 → 강조할 줄 번호(1부터 시작) 배열을 매핑해두고,
 * DiagramPlayer의 render prop 안에서 현재 step으로 active를 계산해 넘긴다.
 *
 *   const HIGHLIGHT: Record<number, number[]> = { 1: [1], 2: [2, 3], 3: [5] };
 *   <CodeHighlight lines={CODE_LINES} active={HIGHLIGHT[step] ?? []} />
 */
export function CodeHighlight({
  lines,
  active,
  title,
}: {
  lines: string[];
  active: number[];
  title?: string;
}) {
  return (
    <div className="overflow-hidden rounded-lg border bg-muted/40">
      {title ? (
        <div className="border-b px-3 py-1.5 font-mono text-xs text-muted-foreground">{title}</div>
      ) : null}
      <pre className="m-0 overflow-x-auto p-0 text-[13px] leading-6">
        {lines.map((line, i) => {
          const isActive = active.includes(i + 1);
          return (
            <div
              key={i}
              className={cn(
                'flex px-3 transition-colors duration-300',
                isActive && 'bg-primary/10 shadow-[inset_2px_0_0] shadow-primary',
              )}
            >
              <span className="mr-3 w-5 select-none text-right text-muted-foreground/60">{i + 1}</span>
              <code className={cn('font-mono', isActive ? 'text-foreground' : 'text-muted-foreground')}>
                {line || ' '}
              </code>
            </div>
          );
        })}
      </pre>
    </div>
  );
}
