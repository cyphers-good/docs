'use client';

/**
 * 레인형 장면 부품: 브랜치 흐름처럼 여러 주체가 가로 레인 위에서
 * 분기·병합하는 도식에 사용한다. (예시: components/git-flow-diagram.tsx)
 */

/** 레인의 기준 가로선. 흐릿하게 깔아두고, 그 위에 커밋과 곡선을 얹는다. */
export function LaneLine({
  x1,
  x2,
  y,
  color,
}: {
  x1: number;
  x2: number;
  y: number;
  color: string;
}) {
  return <line x1={x1} y1={y} x2={x2} y2={y} stroke={color} strokeWidth={2.5} opacity={0.25} />;
}

/** 레인 왼쪽의 이름 라벨. active가 false이면 흐리게 표시하여 아직 등장하지 않았음을 나타낸다. */
export function LaneLabel({
  x,
  y,
  text,
  color,
  active = true,
}: {
  x: number;
  y: number;
  text: string;
  color: string;
  active?: boolean;
}) {
  return (
    <text
      x={x}
      y={y + 4}
      fontSize={13}
      fontWeight={700}
      fill={color}
      style={{
        opacity: active ? 1 : 0.35,
        transition: 'opacity 0.45s ease',
        fontFamily: 'var(--font-mono, monospace)',
      }}
    >
      {text}
    </text>
  );
}

/** 커밋 점. 레인 색으로 테두리를 두른 원이다. */
export function Commit({ x, y, color }: { x: number; y: number; color: string }) {
  return (
    <>
      <circle cx={x} cy={y} r={6.5} fill="var(--color-fd-card, #fff)" stroke={color} strokeWidth={2.5} />
      <circle cx={x} cy={y} r={2.8} fill={color} />
    </>
  );
}

/** 태그·강조 배지. 흐름의 종착점(release tag 등)에 사용한다. */
export function TagBadge({
  x,
  y,
  label,
  color = '#b98900',
}: {
  x: number;
  y: number;
  label: string;
  color?: string;
}) {
  return (
    <>
      <rect x={x} y={y - 14} rx={7} ry={7} width={110} height={28} fill={color} opacity={0.15} stroke={color} strokeWidth={1.5} />
      <text
        x={x + 55}
        y={y + 5}
        fontSize={13}
        fontWeight={700}
        fill={color}
        textAnchor="middle"
        style={{ fontFamily: 'var(--font-mono, monospace)' }}
      >
        🏷 {label}
      </text>
    </>
  );
}
