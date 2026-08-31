'use client';

import { Appear, DrawPath } from './primitives';

/**
 * 시퀀스형 장면 부품: 클라이언트/서버/DB처럼 여러 주체가
 * 요청과 응답을 주고받는 상호작용을 시간 순서로 보여줄 때 사용한다.
 * 주체는 세로 기둥(actor + lifeline)으로, 메시지는 가로 화살표로 표현한다.
 */

/** 상단 주체 박스와 아래로 내려가는 생명선. */
export function SeqActor({
  x,
  label,
  color,
  height,
  width = 96,
}: {
  x: number;
  label: string;
  color: string;
  height: number;
  width?: number;
}) {
  return (
    <g>
      <rect
        x={x - width / 2}
        y={10}
        width={width}
        height={32}
        rx={8}
        fill={color}
        opacity={0.14}
        stroke={color}
        strokeWidth={1.5}
      />
      <text x={x} y={31} fontSize={13} fontWeight={700} fill={color} textAnchor="middle">
        {label}
      </text>
      <line
        x1={x}
        y1={42}
        x2={x}
        y2={height}
        stroke="var(--color-fd-border, #ddd)"
        strokeWidth={1.5}
        strokeDasharray="3 4"
      />
    </g>
  );
}

/**
 * 주체 사이를 오가는 메시지 화살표.
 * step이 `at`에 도달하면 선이 그려지고, 이어서 라벨이 나타난다.
 * 응답·비동기 메시지는 dashed를 켜서 구분한다.
 */
export function SeqMessage({
  at,
  step,
  fromX,
  toX,
  y,
  label,
  color,
  delay = 0,
  dashed = false,
  markerId,
}: {
  at: number;
  step: number;
  fromX: number;
  toX: number;
  y: number;
  label: string;
  color: string;
  delay?: number;
  dashed?: boolean;
  markerId: string;
}) {
  const dir = toX > fromX ? 1 : -1;
  const endX = toX - dir * 6;
  return (
    <>
      <DrawPath
        at={at}
        step={step}
        d={`M${fromX} ${y} L${endX} ${y}`}
        color={color}
        delay={delay}
        width={2}
        dashed={dashed}
        markerEnd={`url(#${markerId})`}
      />
      <Appear at={at} step={step} delay={delay + 0.35}>
        <text
          x={(fromX + toX) / 2}
          y={y - 8}
          fontSize={12}
          fill="var(--color-fd-muted-foreground, #888)"
          textAnchor="middle"
        >
          {label}
        </text>
      </Appear>
    </>
  );
}

/** 생명선 위에서 진행 중인 구간(처리 중임)을 나타내는 세로 활성 막대. */
export function SeqActivation({
  at,
  step,
  x,
  y1,
  y2,
  color,
  delay = 0,
}: {
  at: number;
  step: number;
  x: number;
  y1: number;
  y2: number;
  color: string;
  delay?: number;
}) {
  return (
    <Appear at={at} step={step} delay={delay}>
      <rect x={x - 4} y={y1} width={8} height={y2 - y1} rx={3} fill={color} opacity={0.35} />
    </Appear>
  );
}
