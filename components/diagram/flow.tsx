'use client';

import { Appear, DrawPath } from './primitives';

/**
 * 플로우차트형 장면 부품: 업무 절차, 승인 흐름, 의사결정 분기처럼
 * "박스와 화살표"로 표현하는 도식에 사용한다.
 */

/** 절차 상자. sublabel에 담당자·조건 같은 부가 정보를 넣을 수 있다. */
export function FlowNode({
  at,
  step,
  x,
  y,
  label,
  sublabel,
  color,
  delay = 0,
  width = 128,
  height = 46,
}: {
  at: number;
  step: number;
  x: number;
  y: number;
  label: string;
  sublabel?: string;
  color: string;
  delay?: number;
  width?: number;
  height?: number;
}) {
  return (
    <Appear at={at} step={step} delay={delay}>
      <rect
        x={x - width / 2}
        y={y - height / 2}
        width={width}
        height={height}
        rx={10}
        fill={color}
        opacity={0.14}
        stroke={color}
        strokeWidth={1.5}
      />
      <text
        x={x}
        y={sublabel ? y : y + 5}
        fontSize={13}
        fontWeight={700}
        fill={color}
        textAnchor="middle"
      >
        {label}
      </text>
      {sublabel ? (
        <text x={x} y={y + 16} fontSize={11} fill="var(--color-fd-muted-foreground, #888)" textAnchor="middle">
          {sublabel}
        </text>
      ) : null}
    </Appear>
  );
}

/**
 * 상자 사이를 잇는 화살표. d에 SVG path를 직접 지정하므로 직선·직각·곡선 모두 표현할 수 있다.
 * label은 "승인", "반려"처럼 조건이 있는 분기에서 사용한다.
 */
export function FlowEdge({
  at,
  step,
  d,
  color,
  markerId,
  label,
  labelX,
  labelY,
  delay = 0,
  dashed = false,
}: {
  at: number;
  step: number;
  d: string;
  color: string;
  markerId: string;
  label?: string;
  labelX?: number;
  labelY?: number;
  delay?: number;
  dashed?: boolean;
}) {
  return (
    <>
      <DrawPath
        at={at}
        step={step}
        d={d}
        color={color}
        delay={delay}
        width={2}
        dashed={dashed}
        markerEnd={`url(#${markerId})`}
      />
      {label && labelX !== undefined && labelY !== undefined ? (
        <Appear at={at} step={step} delay={delay + 0.35}>
          <text x={labelX} y={labelY} fontSize={12} fill="var(--color-fd-muted-foreground, #888)" textAnchor="middle">
            {label}
          </text>
        </Appear>
      ) : null}
    </>
  );
}
