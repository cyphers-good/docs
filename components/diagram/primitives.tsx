'use client';

import type { ReactNode } from 'react';

/** 도식 공용 팔레트. 의미가 같은 주체에는 같은 색을 사용한다. */
export const PALETTE = {
  red: '#e5484d', // main 브랜치, 오류·차단 상태
  blue: '#0091ff', // dev 브랜치, 클라이언트
  green: '#30a46c', // feature 브랜치, 서버·성공 상태
  purple: '#8e4ec6', // release 브랜치, DB·저장소
  orange: '#f76b15', // hotfix 브랜치, 경고·대기 상태
  gold: '#b98900', // 태그, 강조 배지
} as const;

export interface StepInfo {
  title: string;
  desc: string;
}

/** step이 `at`에 도달하면 페이드인으로 나타나는 SVG 그룹. delay로 같은 단계 안의 등장 순서를 조절한다. */
export function Appear({
  at,
  step,
  delay = 0,
  children,
}: {
  at: number;
  step: number;
  delay?: number;
  children: ReactNode;
}) {
  const visible = step >= at;
  return (
    <g
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(6px)',
        transition: `opacity 0.45s ease ${delay}s, transform 0.45s ease ${delay}s`,
      }}
    >
      {children}
    </g>
  );
}

/** step이 `at`에 도달하면 선이 그려지는 path. dashed를 켜면 점선이 페이드인된다. */
export function DrawPath({
  at,
  step,
  d,
  color,
  delay = 0,
  width = 2.5,
  dashed = false,
  markerEnd,
}: {
  at: number;
  step: number;
  d: string;
  color: string;
  delay?: number;
  width?: number;
  dashed?: boolean;
  markerEnd?: string;
}) {
  const visible = step >= at;
  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={width}
      strokeLinecap="round"
      markerEnd={markerEnd}
      pathLength={100}
      strokeDasharray={dashed ? '0.01 6' : 100}
      strokeDashoffset={dashed ? 0 : visible ? 0 : 100}
      style={{
        opacity: dashed ? (visible ? 1 : 0) : 1,
        transition: dashed
          ? `opacity 0.5s ease ${delay}s`
          : `stroke-dashoffset 0.7s ease ${delay}s`,
      }}
    />
  );
}

/** 화살표 머리 marker 정의. SVG의 <defs> 안에 넣고 DrawPath의 markerEnd로 참조한다. */
export function ArrowMarker({ id, color }: { id: string; color: string }) {
  return (
    <marker
      id={id}
      viewBox="0 0 10 10"
      refX={8}
      refY={5}
      markerWidth={6.5}
      markerHeight={6.5}
      orient="auto-start-reverse"
    >
      <path d="M0 0 L10 5 L0 10 z" fill={color} />
    </marker>
  );
}
