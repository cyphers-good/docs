'use client';

import { Appear } from './primitives';

/**
 * 타임라인형 장면 부품: 동시성·비동시성 비교, 메인 스레드 점유,
 * 렌더 성능처럼 "시간축 위에서 어떤 작업이 어느 구간을 차지하는가"를
 * 보여줄 때 사용한다. 트랙(스레드·큐)마다 가로줄을 두고, 작업은 막대로 표현한다.
 */

/** 트랙(스레드, 큐 등)의 기준선과 라벨. */
export function TimelineTrack({
  x1,
  x2,
  y,
  label,
  color,
}: {
  x1: number;
  x2: number;
  y: number;
  label: string;
  color: string;
}) {
  return (
    <g>
      <text
        x={8}
        y={y + 4}
        fontSize={13}
        fontWeight={700}
        fill={color}
        style={{ fontFamily: 'var(--font-mono, monospace)' }}
      >
        {label}
      </text>
      <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={2} opacity={0.25} />
    </g>
  );
}

/**
 * 트랙 위의 작업 막대. step이 `at`에 도달하면 왼쪽에서 오른쪽으로 자라난다.
 * 막대 너비가 곧 소요 시간을 의미하므로, 비교 대상 사이의 비율을 지켜서 그린다.
 */
export function TaskBlock({
  at,
  step,
  x,
  y,
  width,
  label,
  color,
  delay = 0,
  height = 26,
}: {
  at: number;
  step: number;
  x: number;
  y: number;
  width: number;
  label: string;
  color: string;
  delay?: number;
  height?: number;
}) {
  const visible = step >= at;
  return (
    <g>
      <g
        style={{
          transform: visible ? 'scaleX(1)' : 'scaleX(0)',
          transformOrigin: `${x}px ${y}px`,
          transition: `transform 0.55s ease ${delay}s`,
        }}
      >
        <rect
          x={x}
          y={y - height / 2}
          width={width}
          height={height}
          rx={6}
          fill={color}
          opacity={0.2}
          stroke={color}
          strokeWidth={1.5}
        />
      </g>
      <Appear at={at} step={step} delay={delay + 0.25}>
        <text x={x + width / 2} y={y + 4} fontSize={12} fontWeight={600} fill={color} textAnchor="middle">
          {label}
        </text>
      </Appear>
    </g>
  );
}

/** 시간 경계 표시선. 프레임 예산(16.7ms), 타임아웃 지점 등을 나타낸다. */
export function TimeMarker({
  x,
  y1,
  y2,
  label,
  color = 'var(--color-fd-muted-foreground, #888)',
}: {
  x: number;
  y1: number;
  y2: number;
  label: string;
  color?: string;
}) {
  return (
    <g>
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth={1.5} strokeDasharray="4 4" />
      <text x={x} y={y1 - 6} fontSize={11} fill={color} textAnchor="middle">
        {label}
      </text>
    </g>
  );
}
